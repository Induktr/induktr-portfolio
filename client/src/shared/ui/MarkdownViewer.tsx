import React, { useMemo } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { ScrollArea } from "@/shared/ui/scroll-area";
import { cn } from "@/shared/lib/utils";

interface MarkdownViewerProps {
  content: string;
  className?: string;
}

/**
 * Senior Refactor: "Cohesive Rendering Protocol"
 * Optimized performance via useMemo and standardized typography.
 */
export function MarkdownViewer({ content, className }: MarkdownViewerProps) {
  const markdownComponents = useMemo(() => ({
    h1: ({ ...props }) => <h1 className="text-2xl font-bold text-primary mb-4 border-b border-border pb-2" {...props} />,
    h2: ({ ...props }) => <h2 className="text-xl font-semibold text-foreground mt-6 mb-3" {...props} />,
    h3: ({ ...props }) => <h3 className="text-lg font-medium text-foreground mt-4 mb-2" {...props} />,
    p: ({ ...props }) => <p className="text-muted-foreground leading-relaxed mb-4 text-sm md:text-base" {...props} />,
    ul: ({ ...props }) => <ul className="list-disc list-inside space-y-1 mb-4 text-muted-foreground" {...props} />,
    ol: ({ ...props }) => <ol className="list-decimal list-inside space-y-1 mb-4 text-muted-foreground" {...props} />,
    li: ({ ...props }) => <li className="pl-1 mb-1" {...props} />,
    blockquote: ({ ...props }) => <blockquote className="border-l-4 border-primary/50 pl-4 italic text-muted-foreground my-4 bg-muted/30 py-2 rounded-r" {...props} />,
    code: ({ node, className, children, ...props }: any) => {
      const isInline = !String(children).includes('\n');
      return isInline ? (
        <code className="bg-secondary/80 px-1.5 py-0.5 rounded text-primary font-mono text-xs md:text-sm" {...props}>
          {children}
        </code>
      ) : (
        <div className="relative group my-6">
          <pre className="bg-zinc-950 p-4 rounded-xl overflow-x-auto border border-border/50 shadow-2xl">
            <code className="text-xs md:text-sm font-mono text-blue-400 block leading-relaxed" {...props}>
              {children}
            </code>
          </pre>
          <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <span className="text-[10px] text-muted-foreground bg-background/50 px-2 py-1 rounded border border-border">CODE</span>
          </div>
        </div>
      );
    },
    a: ({ ...props }) => (
      <a 
        className="text-primary hover:text-primary/80 underline underline-offset-4 transition-colors cursor-pointer font-medium" 
        target="_blank" 
        rel="noreferrer" 
        {...props} 
      />
    ),
  }), []);

  return (
    <ScrollArea className={cn("h-full w-full bg-background/50", className)}>
      <div className="prose prose-invert max-w-none p-6 animate-in fade-in duration-500">
        <ReactMarkdown 
          remarkPlugins={[remarkGfm]}
          components={markdownComponents}
        >
          {content}
        </ReactMarkdown>
      </div>
    </ScrollArea>
  );
}
