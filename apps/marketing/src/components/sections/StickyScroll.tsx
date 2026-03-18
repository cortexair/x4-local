'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import { cn } from '@/lib/utils';
import { CodeBlock } from '@/components/ui/code-block';

interface StickyScrollItem {
  title: string;
  description: string;
  badge: string;
  color: string;
  code?: string;
  visual?: React.ReactNode;
}

interface StickyScrollProps {
  items: StickyScrollItem[];
}

export function StickyScroll({ items }: StickyScrollProps) {
  return (
    <div className="relative">
      {items.map((item, i) => (
        <StickyScrollSection key={item.title} item={item} index={i} isFirst={i === 0} />
      ))}
    </div>
  );
}

function StickyScrollSection({
  item,
  index,
  isFirst,
}: {
  item: StickyScrollItem;
  index: number;
  isFirst: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });

  // First section starts fully visible and only fades on exit
  const opacity = useTransform(
    scrollYProgress,
    isFirst ? [0, 0.05, 0.7, 1] : [0, 0.2, 0.7, 1],
    isFirst ? [1, 1, 1, 0] : [0, 1, 1, 0],
  );
  const x = useTransform(
    scrollYProgress,
    isFirst ? [0, 0.05, 0.7, 1] : [0, 0.2, 0.7, 1],
    isFirst ? [0, 0, 0, 0] : [index % 2 === 0 ? -40 : 40, 0, 0, index % 2 === 0 ? -40 : 40],
  );

  return (
    <div ref={ref} className="min-h-screen py-24">
      <div className="sticky top-24 mx-auto max-w-7xl px-6">
        <motion.div
          style={{ opacity, x }}
          className={cn(
            'grid items-center gap-12 lg:grid-cols-2',
            index % 2 === 1 && 'lg:grid-flow-dense',
          )}
        >
          {/* Content */}
          <div className={cn(index % 2 === 1 && 'lg:col-start-2')}>
            <span
              className={cn(
                'inline-block rounded-full px-3 py-1 text-xs font-semibold',
                item.color,
              )}
            >
              {item.badge}
            </span>
            <h3 className="mt-4 text-3xl font-bold sm:text-4xl">{item.title}</h3>
            <p className="mt-4 max-w-lg text-lg leading-relaxed text-muted-foreground">
              {item.description}
            </p>
          </div>

          {/* Right panel — code or visual */}
          <div className={cn(index % 2 === 1 && 'lg:col-start-1')}>
            {item.code ? (
              <div className="overflow-hidden rounded-xl border border-border bg-card">
                <div className="flex items-center gap-2 border-b border-border px-4 py-3">
                  <span className="h-3 w-3 rounded-full bg-red-500/60" />
                  <span className="h-3 w-3 rounded-full bg-yellow-500/60" />
                  <span className="h-3 w-3 rounded-full bg-green-500/60" />
                </div>
                <CodeBlock
                  code={item.code}
                  className="overflow-x-auto p-6 font-mono text-sm leading-relaxed"
                />
              </div>
            ) : (
              item.visual
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
