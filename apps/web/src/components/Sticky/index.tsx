import { throttle } from 'lodash';
import React, { useEffect, useMemo, useRef, useState } from 'react';

interface StickyProps {
  top: number;
  children: React.ReactElement;
}

const StickyTop: React.FC<StickyProps> = (props) => {
  const { children, top } = props;
  const ref = useRef<HTMLDivElement>(null);
  const [inSticky, setInSticky] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      const { current: container } = ref;
      if (!container) return;
      const { top: currentTop } = container.getBoundingClientRect();
      if (currentTop <= top) {
        setInSticky(true);
      } else {
        setInSticky(false);
      }
    };
    const onScrollThrottled = throttle(onScroll, 60, { trailing: true });
    window.addEventListener('scroll', onScrollThrottled);

    return () => {
      window.removeEventListener('scroll', onScrollThrottled);
    };
  }, []);

  const eleInPlace = useMemo(
    () =>
      React.cloneElement(children, {
        style: Object.assign(
          { visibility: inSticky ? 'hidden' : 'unset' },
          children?.props?.style ?? {},
        ),
      }),
    [inSticky],
  );

  const eleInSticky = useMemo(
    () =>
      React.cloneElement(children, {
        style: Object.assign({ position: 'fixed', top: `${top}px` }, children?.props?.style ?? {}),
      }),
    [top],
  );

  return (
    <div ref={ref}>
      {eleInPlace}
      {inSticky && eleInSticky}
    </div>
  );
};

export default StickyTop;
