import { useEffect, useRef } from "react";

export default function (
  effect: React.EffectCallback,
  deps?: React.DependencyList
): void {
  var hasMounted = useRef(false);
  useEffect(() => {
    if (hasMounted.current) return;
    hasMounted.current = true;
    effect();
  }, deps);
}
