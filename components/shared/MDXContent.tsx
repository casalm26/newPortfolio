'use client';

import { useMDXComponent } from 'next-contentlayer2/hooks';

interface MDXContentProps {
  source: string;
}

export function MDXContent({ source }: MDXContentProps) {
  const Component = useMDXComponent(source);
  
  return (
    <div className="mdx-content">
      <Component />
    </div>
  );
}