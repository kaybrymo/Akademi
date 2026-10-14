import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Universal ScrollToTop component
 * Automatically scrolls window, document, and layout containers to the very top on every route navigation.
 */
export default function ScrollToTop() {
  const { pathname, search } = useLocation();

  useEffect(() => {
    // 1. Reset window and document scrolling
    window.scrollTo(0, 0);
    document.documentElement.scrollTo(0, 0);
    document.body.scrollTo(0, 0);

    // 2. Reset any nested dashboard main container scrolling
    const mainContainers = document.querySelectorAll('main, .overflow-y-auto, [data-scroll-container]');
    mainContainers.forEach(container => {
      container.scrollTo(0, 0);
    });
  }, [pathname, search]);

  return null;
}
