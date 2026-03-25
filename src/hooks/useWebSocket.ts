import { useEffect, useRef, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import type { AppDispatch } from '../store';
import { appendMessage, updateRoomLastMessage } from '../store/slices/chatSlice';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
const WS_URL = import.meta.env.VITE_WS_URL || API_BASE_URL.replace(/^http/, 'ws').replace(/\/api\/?$/, '/ws');

type Handler = (data: any) => void;

export function useWebSocket(token: string | null) {
  const ws        = useRef<WebSocket | null>(null);
  const dispatch  = useDispatch<AppDispatch>();
  const handlers  = useRef<Record<string, Handler[]>>({});
  const connected = useRef(false);

  const on = useCallback((type: string, fn: Handler) => {
    if (!handlers.current[type]) handlers.current[type] = [];
    handlers.current[type].push(fn);
    return () => {
      handlers.current[type] = handlers.current[type].filter((h) => h !== fn);
    };
  }, []);

  const send = useCallback((data: object) => {
    if (ws.current?.readyState === WebSocket.OPEN) {
      ws.current.send(JSON.stringify(data));
    }
  }, []);

  useEffect(() => {
    if (!token) return;

    const socket = new WebSocket(WS_URL);
    ws.current = socket;

    socket.onopen = () => {
      connected.current = true;
      socket.send(JSON.stringify({ type: 'auth', token }));
    };

    socket.onmessage = (event) => {
      let data: any;
      try { data = JSON.parse(event.data); } catch { return; }

      // dispatch to Redux
      if (data.type === 'message') {
        dispatch(appendMessage({ roomId: data.roomId, message: data.message }));
        dispatch(updateRoomLastMessage({ roomId: data.roomId, content: data.message.content }));
      }

      // call local handlers
      (handlers.current[data.type] || []).forEach((fn) => fn(data));
    };

    socket.onclose = () => { connected.current = false; };
    socket.onerror = (e) => { console.error('WS error', e); };

    return () => {
      socket.close();
      ws.current = null;
    };
  }, [token, dispatch]);

  return { send, on };
}
