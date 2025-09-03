import { useEffect, useRef, useState } from 'react';

// Lightweight dynamic import to avoid SSR issues
let StompLib: any = null;
const loadStomp = async () => {
  if (StompLib) return StompLib;
  // Using dynamic import keeps bundle smaller if feature unused
  const mod = await import('@stomp/stompjs');
  StompLib = mod;
  return StompLib;
};

export interface PresenceUpdatePayload {
  type: string; // PRESENCE_UPDATE
  joined?: string[];
  left?: string[];
  online?: string[];
}

interface UseDeveloperPresenceOptions {
  token?: string; // JWT access token
  endpoint?: string; // ws(s)://host/ws
  activityIntervalMs?: number; // default 30000
  disabled?: boolean; // allow manual off
  debug?: boolean;
  initialFetch?: boolean; // GET /api/presence to seed list
  initialFetchUrl?: string; // default /api/presence
  sendInitialConnectFrame?: boolean; // /app/presence/connect
  includeBearerInQuery?: boolean; // pass token param as 'Bearer <JWT>'
}

interface PresenceState {
  online: string[];
  lastEvent?: PresenceUpdatePayload;
  connected: boolean;
  error?: string;
}

/**
 * useDeveloperPresence
 * Responsibilities:
 * - Establish STOMP over WebSocket connection with JWT query param token
 * - Subscribe /topic/presence
 * - Maintain online developers list
 * - Send heartbeat (/app/ping) periodically (server TBD; safe to fire & ignore)
 * - Auto-reconnect with exponential backoff up to 30s
 */
export function useDeveloperPresence({
  token,
  endpoint,
  activityIntervalMs = 30000,
  disabled,
  debug = true, // 디버그 활성화
  initialFetch = true,
  initialFetchUrl = '/api/presence',
  sendInitialConnectFrame = true,
  includeBearerInQuery = true,
}: UseDeveloperPresenceOptions) {
  const [state, setState] = useState<PresenceState>({ online: [], connected: false });
  const clientRef = useRef<any>(null);
  const heartbeatTimerRef = useRef<any>(null);
  const reconnectAttemptsRef = useRef(0);
  const manuallyClosedRef = useRef(false);

  useEffect(() => {
    if (disabled) return;
    if (!token) return; // wait for token
    let cancelled = false;

    (async () => {
  const { Client } = await loadStomp();
  const url = buildWsUrl(endpoint || defaultEndpoint(), token, includeBearerInQuery);
      if (debug) console.log('[presence] connecting', url);

      const client = new Client({
        brokerURL: url,
        reconnectDelay: 0, // we implement custom backoff
        // STOMP 내부 구현이 this.debug()를 무조건 호출하는 경로가 있어 undefined 면 오류 발생 -> 항상 no-op 제공
        debug: (msg: string) => { if (debug) { try { console.log('[stomp]', msg); } catch {/* noop */} } },
        onConnect: () => {
          if (cancelled) return;
            reconnectAttemptsRef.current = 0;
            setState(s => ({ ...s, connected: true, error: undefined }));
            if (debug) console.log('[presence] connected');
            client.subscribe('/topic/presence', (frame: any) => {
              try {
                const body: PresenceUpdatePayload = JSON.parse(frame.body);
                setState(s => ({
                  ...s,
                  online: body.online || s.online,
                  lastEvent: body,
                }));
              } catch (e) {
                if (debug) console.warn('[presence] parse error', e);
              }
            });
            // optional initial connect frame
            if (sendInitialConnectFrame) {
              try { client.publish({ destination: '/app/presence/connect', body: '{}' }); } catch {}
            }
            // initial fetch (REST) to seed if list empty or broadcast 안 온 경우 대비
      if (initialFetch) {
              try {
        const fetchUrl = resolveInitialFetchUrl(initialFetchUrl);
        fetch(fetchUrl, {
                  headers: token ? { 'Authorization': `Bearer ${token}` } : undefined,
                  credentials: 'include'
                })
                  .then(r => r.ok ? r.json() : Promise.reject(r.status))
                  .then((data) => {
                    // 기대 형식: { online: string[] } 또는 string[]
                    const online = Array.isArray(data) ? data : (Array.isArray(data?.online) ? data.online : null);
                    if (online) setState(s => ({ ...s, online }));
                    if (debug) console.log('[presence] initial fetch ok', online);
                  })
                  .catch(err => { if (debug) console.warn('[presence] initial fetch fail', err); });
              } catch (e) {
                if (debug) console.warn('[presence] initial fetch error', e);
              }
            }
            // start activity heartbeat (/app/presence/activity)
            if (heartbeatTimerRef.current) clearInterval(heartbeatTimerRef.current);
            heartbeatTimerRef.current = setInterval(() => {
              if (client.connected) {
                try {
                  client.publish({ destination: '/app/presence/activity', body: JSON.stringify({ ts: Date.now() }) });
                } catch {}
              }
            }, activityIntervalMs);
        },
        onStompError: (frame: any) => {
          if (debug) console.error('[presence] STOMP error', frame.headers['message']);
          setState(s => ({ ...s, error: frame.headers['message'] }));
        },
        onWebSocketClose: () => {
          if (cancelled) return;
          setState(s => ({ ...s, connected: false }));
          if (manuallyClosedRef.current) return;
          scheduleReconnect();
        },
        onWebSocketError: () => {
          if (debug) console.error('[presence] websocket error');
        },
      });

      clientRef.current = client;
      client.activate();
    })();

    function scheduleReconnect() {
      const attempt = ++reconnectAttemptsRef.current;
      const delay = Math.min(30000, Math.pow(2, attempt) * 500); // 0.5s,1s,2s,...
      if (debug) console.log(`[presence] reconnect attempt ${attempt} in ${delay}ms`);
      setTimeout(() => {
        if (cancelled) return;
        if (clientRef.current && !clientRef.current.active) {
          clientRef.current.activate();
        }
      }, delay);
    }

    return () => {
      cancelled = true;
      manuallyClosedRef.current = true;
      if (heartbeatTimerRef.current) clearInterval(heartbeatTimerRef.current);
      if (clientRef.current) {
        try { clientRef.current.deactivate(); } catch {}
      }
    };
  }, [token, endpoint, activityIntervalMs, disabled, debug, initialFetch, initialFetchUrl, sendInitialConnectFrame, includeBearerInQuery]);

  return state;
}

// Helpers
function defaultEndpoint() {
  // 1) Explicit env override
  if (typeof process !== 'undefined' && process.env.NEXT_PUBLIC_WS_URL) {
    return process.env.NEXT_PUBLIC_WS_URL;
  }
  // 2) Dev heuristic: if running on Next dev (3000) assume backend 8080
  if (typeof window === 'undefined') return 'ws://localhost:8080/ws';
  const loc = window.location;
  const proto = loc.protocol === 'https:' ? 'wss:' : 'ws:';
  if (loc.port === '3000') {
    return `${proto}//${loc.hostname}:8080/ws`;
  }
  return `${proto}//${loc.host}/ws`;
}

function buildWsUrl(base: string, token: string, includeBearer?: boolean) {
  const sep = base.includes('?') ? '&' : '?';
  const value = includeBearer ? `Bearer ${token}` : token;
  return `${base}${sep}token=${encodeURIComponent(value)}`;
}

export type { PresenceState };

function resolveInitialFetchUrl(url: string) {
  if (typeof window === 'undefined') return url;
  if (url.startsWith('http')) return url;
  // dev 환경(front 3000, backend 8080) 자동 변환
  if (window.location.port === '3000') {
    return `http://localhost:8080${url}`;
  }
  return url; // same-origin
}