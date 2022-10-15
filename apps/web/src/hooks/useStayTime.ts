import { useEffect, useRef } from "react";
import Timer from "../utils/timer";

const useStayTime = () => {
  const {current: timer } = useRef(new Timer());

  const handleVisibilityChange = () => {
    if (document.visibilityState === 'hidden') {
      timer.pause();
    }
    if (document.visibilityState === 'visible') {
      timer.start();
    } 
  };

  useEffect(() => {
    timer.start();
    document.addEventListener('visibilitychange', handleVisibilityChange);
  }, []);

  return () => timer.spanTime;
};

export default useStayTime;