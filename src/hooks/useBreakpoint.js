import { isArray } from 'lodash';
import { useState, useEffect } from 'react';

/**
 * Returns true if current viewport size matches provided breakpoint(s)
 * @param {String|Array} toMatch breakpoint(s) to match
 */
export default function useBreakpoints(toMatch) {
  const [breakpoints, setBreakpoints] = useState({
    xs: false,
    sm: false,
    md: false,
    lg: false,
    xl: false,
    xxl: false
  });

  useEffect(() => {
    function handleResize() {
      setBreakpoints({
        xs: window.matchMedia('(min-width: 1px)').matches,
        sm: window.matchMedia('(min-width: 576px)').matches,
        md: window.matchMedia('(min-width: 768px)').matches,
        lg: window.matchMedia('(min-width: 992px)').matches,
        xl: window.matchMedia('(min-width: 1200px)').matches,
        xxl: window.matchMedia('(min-width: 1600px)').matches
      });
    }

    window.addEventListener('resize', handleResize);

    // set initial value
    handleResize();

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return isArray(toMatch)
    ? toMatch.every((bp) => breakpoints[bp])
    : breakpoints[toMatch];
}
