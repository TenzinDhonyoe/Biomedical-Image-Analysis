'use client';

import { useEffect, useRef } from 'react';
import katex from 'katex';

export function InlineMath({ math }: { math: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    if (ref.current) {
      katex.render(math, ref.current, { throwOnError: false, displayMode: false });
    }
  }, [math]);
  return <span ref={ref} />;
}

export function BlockMath({ math }: { math: string }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (ref.current) {
      katex.render(math, ref.current, { throwOnError: false, displayMode: true });
    }
  }, [math]);
  return <div ref={ref} className="my-1.5 overflow-x-auto" />;
}
