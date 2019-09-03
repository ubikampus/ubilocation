import styled from 'styled-components';
import { useEffect } from 'react';

const Fullscreen = styled.div`
  display: flex;
  flex-direction: column;

  height: 100vh; /* fallback */
  height: calc(var(--vh, 1vh) * 100);

  overflow-x: hidden;
`;

export const FullscreenRow = styled.div`
  display: flex;
  height: 100%;
`;

/**
 * 100vh workaround for mobile.
 *
 * https://css-tricks.com/the-trick-to-viewport-units-on-mobile/
 *
 * Without this, the content will overflow from the bottom.
 */
export const useDynamicViewportHeight = () => {
  useEffect(() => {
    const updateViewportHeight = () => {
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty('--vh', `${vh}px`);
    };

    window.addEventListener('resize', updateViewportHeight);

    updateViewportHeight();
    return () => {
      window.removeEventListener('resize', updateViewportHeight);
    };
  }, []);
};

export default Fullscreen;
