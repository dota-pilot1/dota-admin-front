import { useEffect, useState } from 'react';

interface SimplePresenceState {
  online: string[];
  connected: boolean;
  error?: string;
}

/**
 * 가장 단순한 개발자 현황 훅 (테스트용)
 * 로그인 시 자동 등록 + 주기적 fetch
 */
export function useSimplePresence(token?: string) {
  const [state, setState] = useState<SimplePresenceState>({ 
    online: [], 
    connected: false 
  });

  useEffect(() => {
    if (!token) {
      console.log('[presence] No token, skipping');
      return;
    }

    console.log('[presence] Starting with token:', token?.substring(0, 20) + '...');

    // 자동 등록 (최초 1회)
    const autoConnect = async () => {
      try {
        const url = window.location.port === '3000' 
          ? 'http://localhost:8080/api/presence/connect'
          : '/api/presence/connect';
        
        console.log('[presence] Auto-connecting to:', url);
        
        await fetch(url, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          credentials: 'include'
        });
        
        console.log('[presence] Auto-connect completed');
      } catch (error) {
        console.warn('[presence] Auto-connect failed:', error);
      }
    };

    // 주기적 상태 확인
    const fetchPresence = async () => {
      try {
        const url = window.location.port === '3000' 
          ? 'http://localhost:8080/api/presence'
          : '/api/presence';
        
        console.log('[presence] Fetching from:', url);
        
        const response = await fetch(url, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          credentials: 'include'
        });

        console.log('[presence] Response status:', response.status);
        
        if (response.ok) {
          const data = await response.json();
          console.log('[presence] Response data:', data);
          setState(s => ({ 
            ...s, 
            online: Array.isArray(data.online) ? data.online : [], 
            connected: true,
            error: undefined
          }));
        } else {
          throw new Error(`HTTP ${response.status}`);
        }
      } catch (error) {
        console.error('[presence] Fetch error:', error);
        setState(s => ({ 
          ...s, 
          error: error instanceof Error ? error.message : 'Unknown error',
          connected: false
        }));
      }
    };

    // 즉시 연결 시도
    autoConnect().then(() => {
      // 연결 후 상태 확인
      setTimeout(fetchPresence, 1000);
    });

    // 10초마다 상태 확인
    const interval = setInterval(fetchPresence, 10000);

    return () => clearInterval(interval);
  }, [token]);

  return state;
}
