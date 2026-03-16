'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import type { RealtimeChannel, RealtimePostgresChangesPayload } from '@supabase/supabase-js';

type RealtimeEvent = 'INSERT' | 'UPDATE' | 'DELETE';

interface UseSupabaseRealtimeOptions<T> {
  table: string;
  /** Initial fetch via API route (keeps existing API logic) */
  fetchUrl: string;
  /** Which events to listen for (default: all) */
  events?: RealtimeEvent[];
  /** Primary key field for matching on UPDATE/DELETE (default: 'id') */
  primaryKey?: keyof T;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function useSupabaseRealtime<T extends Record<string, any>>({
  table,
  fetchUrl,
  events = ['INSERT', 'UPDATE', 'DELETE'],
  primaryKey = 'id' as keyof T,
}: UseSupabaseRealtimeOptions<T>) {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const channelRef = useRef<RealtimeChannel | null>(null);

  // Initial fetch via existing API route
  const fetchData = useCallback(async () => {
    try {
      const res = await fetch(fetchUrl);
      const json = await res.json();
      setData(json);
    } catch {
      setData([]);
    } finally {
      setLoading(false);
    }
  }, [fetchUrl]);

  useEffect(() => {
    fetchData();

    // Subscribe to Realtime changes
    const channel = supabase
      .channel(`realtime-${table}`)
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table },
        (payload: RealtimePostgresChangesPayload<T>) => {
          const eventType = payload.eventType;
          if (!events.includes(eventType)) return;

          if (eventType === 'INSERT') {
            const newRow = payload.new as T;
            setData((prev) => [...prev, newRow]);
          } else if (eventType === 'UPDATE') {
            const updated = payload.new as T;
            setData((prev) =>
              prev.map((row) =>
                row[primaryKey] === updated[primaryKey] ? updated : row
              )
            );
          } else if (eventType === 'DELETE') {
            const deleted = payload.old as Partial<T>;
            setData((prev) =>
              prev.filter((row) => row[primaryKey] !== deleted[primaryKey])
            );
          }
        }
      )
      .subscribe((status) => {
        if (status === 'CHANNEL_ERROR') {
          // 재연결: 채널 에러 시 전체 데이터 다시 fetch
          setTimeout(fetchData, 3000);
        }
      });

    channelRef.current = channel;

    return () => {
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
        channelRef.current = null;
      }
    };
  }, [table, fetchUrl, fetchData, events, primaryKey]);

  return { data, loading, refetch: fetchData };
}
