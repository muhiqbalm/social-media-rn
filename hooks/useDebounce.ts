import { useEffect, useState } from "react";

/**
 * Hook useDebounce
 * Menyediakan state biasa (value & setValue) dan juga value yang telah di-debounce.
 *
 * @param initialValue Nilai awal dari state
 * @param delay Delay dalam milidetik sebelum debouncedValue diperbarui
 * @returns [value, setValue, debouncedValue]
 */

export function useDebounce<T>(
  initialValue: T,
  delay: number
): [T, React.Dispatch<React.SetStateAction<T>>, T] {
  const [value, setValue] = useState<T>(initialValue);
  const [debouncedValue, setDebouncedValue] = useState<T>(initialValue);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return [debouncedValue, setValue, value];
}
