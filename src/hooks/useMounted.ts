import { EffectCallback, useEffect } from "react";

const useMounted = (effect: EffectCallback) => {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(effect, []);
};

export default useMounted;
