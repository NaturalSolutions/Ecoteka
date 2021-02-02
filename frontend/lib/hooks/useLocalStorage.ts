import { useState } from "react";

function isJSON(str) {
  try {
    JSON.parse(str);
    return true;
  } catch (err) {
    return false;
  }
}

export default function useLocalStorage<T>(key: string, initialValue?: T) {
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (typeof window === "undefined") {
      return initialValue || null;
    }

    try {
      const item = window.localStorage.getItem(key);

      if (isJSON(item)) {
        return item ? JSON.parse(item) : initialValue;
      } else {
        return item ? item : initialValue;
      }
    } catch (error) {
      return null;
    }
  });

  const setValue = (value: T) => {
    if (typeof window === "undefined") {
      return;
    }

    try {
      setStoredValue(value);

      if (value === null) {
        window.localStorage.removeItem(key);
      } else {
        const item = JSON.stringify(value);
        window.localStorage.setItem(key, item);
      }
    } catch (error) {}
  };

  return [storedValue, setValue] as const;
}
