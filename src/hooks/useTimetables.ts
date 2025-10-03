'use client';

import { useState, useEffect } from 'react';
import { SavedTimetable } from '@/types/timetable';

const STORAGE_KEY = 'saved_timetables';

export function useTimetables() {
  const [timetables, setTimetables] = useState<SavedTimetable[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setTimetables(
          parsed.map((t: SavedTimetable) => ({
            ...t,
            createdAt: new Date(t.createdAt),
            lastUsed: new Date(t.lastUsed),
          }))
        );
      } catch (error) {
        console.error('Failed to parse stored timetables:', error);
      }
    }
  }, []);

  const saveTimetable = (
    fromStation: { name: string; signature: string },
    toStation: { name: string; signature: string }
  ) => {
    const existing = timetables.find(
      (t) =>
        t.fromStation.signature === fromStation.signature &&
        t.toStation.signature === toStation.signature
    );

    if (existing) {
      const updated = timetables.map((t) =>
        t.id === existing.id ? { ...t, lastUsed: new Date() } : t
      );
      setTimetables(updated);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return existing;
    }

    const newTimetable: SavedTimetable = {
      id: crypto.randomUUID(),
      fromStation,
      toStation,
      createdAt: new Date(),
      lastUsed: new Date(),
    };

    const updated = [...timetables, newTimetable];
    setTimetables(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return newTimetable;
  };

  const deleteTimetable = (id: string) => {
    const updated = timetables.filter((t) => t.id !== id);
    setTimetables(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  };

  const updateLastUsed = (id: string) => {
    const updated = timetables.map((t) =>
      t.id === id ? { ...t, lastUsed: new Date() } : t
    );
    setTimetables(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  };

  return {
    timetables,
    saveTimetable,
    deleteTimetable,
    updateLastUsed,
  };
}
