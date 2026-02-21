import { useRef, useState, useEffect, type ReactNode } from 'react';

/**
 * LazySection — Only mounts children when the section enters (or is about to enter) the viewport.
 * Uses IntersectionObserver with a generous rootMargin so content appears before the user scrolls to it.
 * Once mounted, children stay mounted (no unmount on scroll-away) to avoid layout thrash.
 */
export function LazySection({
  children,
  className,
  rootMargin = '200px 0px',
  minHeight = 200,
  placeholder,
}: {
  children: ReactNode;
  className?: string;
  /** How far outside the viewport to start mounting. Default 200px above/below. */
  rootMargin?: string;
  /** Minimum placeholder height before mount, prevents layout collapse. */
  minHeight?: number;
  /** Optional custom placeholder. Defaults to an empty div with minHeight. */
  placeholder?: ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || mounted) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setMounted(true);
          observer.disconnect();
        }
      },
      { rootMargin }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [mounted, rootMargin]);

  return (
    <div ref={ref} className={className}>
      {mounted
        ? children
        : placeholder ?? <div style={{ minHeight }} />}
    </div>
  );
}
