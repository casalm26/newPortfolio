"use client";

import { useMDXComponent } from "next-contentlayer2/hooks";
import * as jsxRuntime from "react/jsx-runtime";

interface MDXContentProps {
  source: string;
}

export function MDXContent({ source }: MDXContentProps) {
  const Component = useMDXComponent(source, { _jsx_runtime: jsxRuntime });

  return (
    <div className="mdx-content">
      <Component />
    </div>
  );
}
