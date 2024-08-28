import { useRef } from "react";

export default function usePrevious<T>(value: T) {
  const previousRef = useRef<T>();
  const currentRef = useRef<T>(value);

  if (currentRef.current !== value) {
    previousRef.current = currentRef.current;
    currentRef.current = value;
  }

  return previousRef.current;
}
