import { useEffect, useRef, useState } from 'react';

// Lightweight dynamic import to avoid SSR issues
let StompLib: any = null;
const loadStomp = async () => {
  if (StompLib) return StompLib;
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
 * useDeveloperPresence - Enhanced WebSocket STOMP Implementation
 * 
 * Features:
 * - Establishes STOMP over WebSocket connection
 * - Handles JWT authentication via message-based auth
 * - Subscribes to /topic/presence for real-time updates
 * - Maintains online developers list with auto-reconnect
 * - Sends periodic activity heartbeats
 * - Exponential backoff reconnection strategy
 */
export function useDeveloperPresence({
  token,
  endpoint,
  activityIntervalMs = 30000,
  disabled,
  debug = true,
  initialFetch = true,
  initialFetchUrl = '/api/presence',
  sendInitialConnectFrame = true,
  includeBearerInQuery = false, // 메시지 기반 인증 사용
}: UseDeveloperPresenceOptions) {
  const [state, setState] = useState<PresenceState>({ online: [], connected: false });
  const clientRef = useRef<any>(null);
  const heartbeatTimerRef = useRef<any>(null);
  const reconnectAttemptsRef = useRef(0);
  const manuallyClosedRef = useRef(false);
  const authSentRef = useRef(false);

  useEffect(() => {
    if (disabled) return;
    if (!token) return;
    let cancelled = false;

    (async () => {
      const { Client } = await loadStomp();
      const url = endpoint || defaultEndpoint();
      if (debug) console.log('[presence] connecting to:', url);

      const client = new Client({
        brokerURL: url,
        reconnectDelay: 0, // 커스텀 재연결 로직 사용
        debug: debug ? (msg: string) => console.log('[stomp]', msg) : undefined,
        
        onConnect: () => {
          if (cancelled) return;
          reconnectAttemptsRef.current = 0;
          authSentRef.current = false;
          setState(s => ({ ...s, connected: true, error: undefined }));
          if (debug) console.log('[presence] connected, sending auth...');

          // 메시지 기반 인증 시도
          try {
            client.publish({
              destination: '/app/presence/auth',
              body: JSON.stringify({ token })
            });
            authSentRef.current = true;
            if (debug) console.log('[presence] auth message sent');
          } catch (e) {
            if (debug) console.error('[presence] auth send failed:', e);
          }

          // /topic/presence 구독
          client.subscribe('/topic/presence', (frame: any) => {
            try {
              const body: PresenceUpdatePayload = JSON.parse(frame.body);
              if (debug) console.log('[presence] received update:', body);
              setState(s => ({
                ...s,
                online: body.online || s.online,
                lastEvent: body,
              }));
            } catch (e) {
              if (debug) console.warn('[presence] parse error:', e);
            }
          });

          // 초기 연결 프레임 (선택적)
          if (sendInitialConnectFrame) {
            try {
              client.publish({ destination: '/app/presence/connect', body: '{}' });
            } catch (e) {
              if (debug) console.warn('[presence] connect frame failed:', e);
            }
          }

          // REST API로 초기 상태 가져오기
          if (initialFetch) {
            fetchInitialPresence();
          }

          // 주기적 활동 신호
          startHeartbeat(client);
        },

        onStompError: (frame: any) => {
          const errorMsg = frame.headers['message'] || 'STOMP error';
          if (debug) console.error('[presence] STOMP error:', errorMsg);
          setState(s => ({ ...s, error: errorMsg }));
        },

        onWebSocketClose: () => {
          if (cancelled) return;
          setState(s => ({ ...s, connected: false }));
          if (manuallyClosedRef.current) return;
          scheduleReconnect();
        },

        onWebSocketError: (error: any) => {
          if (debug) console.error('[presence] websocket error:', error);
        },
      });

      clientRef.current = client;
      client.activate();
    })();

    function fetchInitialPresence() {
      try {
        const fetchUrl = resolveInitialFetchUrl(initialFetchUrl);
        fetch(fetchUrl, {
          headers: token ? { 'Authorization': `Bearer ${token}` } : undefined,
          credentials: 'include'
        })
          .then(r => r.ok ? r.json() : Promise.reject(r.status))
          .then((data) => {
            const online = Array.isArray(data) ? data : (Array.isArray(data?.online) ? data.online : []);
            setState(s => ({ ...s, online }));
            if (debug) console.log('[presence] initial fetch success:', online);
          })
          .catch(err => {
            if (debug) console.warn('[presence] initial fetch failed:', err);
          });
      } catch (e) {
        if (debug) console.warn('[presence] initial fetch error:', e);
      }
    }

    function startHeartbeat(client: any) {
      if (heartbeatTimerRef.current) clearInterval(heartbeatTimerRef.current);
      heartbeatTimerRef.current = setInterval(() => {
        if (client.connected) {
          try {
            client.publish({
              destination: '/app/presence/activity',
              body: JSON.stringify({ ts: Date.now() })
            });
          } catch (e) {
            if (debug) console.warn('[presence] heartbeat failed:', e);
          }
        }
      }, activityIntervalMs);
    }

    function scheduleReconnect() {
      const attempt = ++reconnectAttemptsRef.current;
      const delay = Math.min(30000, Math.pow(2, attempt) * 500);
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
        try {
          clientRef.current.deactivate();
        } catch (e) {
          if (debug) console.warn('[presence] cleanup error:', e);
        }
      }
    };
  }, [token, endpoint, activityIntervalMs, disabled, debug, initialFetch, initialFetchUrl, sendInitialConnectFrame]);

  return state;
}

// Helper functions
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

function resolveInitialFetchUrl(url: string) {
  if (typeof window === 'undefined') return url;
  if (url.startsWith('http')) return url;
  // dev 환경(front 3000, backend 8080) 자동 변환
  if (window.location.port === '3000') {
    return `http://localhost:8080${url}`;
  }
  return url; // same-origin
}

export type { PresenceState };