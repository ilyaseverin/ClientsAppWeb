import { useState, useEffect } from "react";

/**
 * Хук debounce для уменьшения частоты вызова функции.
 *
 * @param value Значение, которое нужно дебаунсить.
 * @param delay Задержка в миллисекундах.
 * @returns Дебаунсное значение.
 */
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}
