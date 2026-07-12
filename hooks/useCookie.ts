import { useState, useEffect } from 'react';

function getCookie(name: string) {
  if (typeof document === "undefined") {
    return null;
  }
  const match = document.cookie
    .split("; ")
    .find((cookie) => cookie.startsWith(`${name}=`));

  return match ? decodeURIComponent(match.split("=")[1]) : null;
}

function setCookie(name: string, value: string, days = 30) {
  if (typeof document === "undefined") {
    return;
  }
  const expires = new Date(Date.now() + days * 24 * 60 * 60 * 1000);
  document.cookie = `${name}=${encodeURIComponent(
    value,
  )}; expires=${expires.toUTCString()}; path=/; SameSite=Lax`;
}

export function useCookie<T>(name: string, initialValue: T) {
  const [value, setValueState] = useState<T>(initialValue);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    queueMicrotask(() => {
      const stored = getCookie(name);
      if (stored !== null) {
        try {
          setValueState(JSON.parse(stored) as T);
        } catch {
          // Fallback for primitive string cookies
          setValueState(stored as unknown as T);
        }
      }
      setIsLoaded(true);
    });
  }, [name]);

  const setValue = (newValue: T, days = 30) => {
    setValueState(newValue);
    const stringValue = typeof newValue === 'string' ? newValue : JSON.stringify(newValue);
    setCookie(name, stringValue, days);
  };

  return [value, setValue, isLoaded] as const;
}
