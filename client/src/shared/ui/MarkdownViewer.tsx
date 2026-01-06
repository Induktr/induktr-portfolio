import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { ScrollArea } from "@/shared/ui/scroll-area";
import { cn } from "@/shared/lib/utils";

interface MarkdownViewerProps {
  content: string;
  className?: string;
}

export function MarkdownViewer({ content, className }: MarkdownViewerProps) {
  return (
    <ScrollArea className={cn("h-full w-full", className)}>
      <div className="prose prose-invert prose-sm md:prose-base max-w-none p-4">
        <ReactMarkdown 
          remarkPlugins={[remarkGfm]}
          components={{
            h1: ({node, ...props}) => <h1 className="text-2xl font-bold text-primary mb-4 border-b border-border pb-2" {...props} />,
            h2: ({node, ...props}) => <h2 className="text-xl font-semibold text-foreground mt-6 mb-3" {...props} />,
            h3: ({node, ...props}) => <h3 className="text-lg font-medium text-foreground mt-4 mb-2" {...props} />,
            p: ({node, ...props}) => <p className="text-muted-foreground leading-relaxed mb-4" {...props} />,
            ul: ({node, ...props}) => <ul className="list-disc list-inside space-y-1 mb-4 text-muted-foreground" {...props} />,
            ol: ({node, ...props}) => <ol className="list-decimal list-inside space-y-1 mb-4 text-muted-foreground" {...props} />,
            li: ({node, ...props}) => <li className="pl-1" {...props} />,
            blockquote: ({node, ...props}) => <blockquote className="border-l-4 border-primary/50 pl-4 italic text-muted-foreground my-4" {...props} />,
            code: ({node, className, children, ...props}) => {
                const isInline = !String(children).includes('\n');
                return isInline ? (
                  <code className="bg-secondary px-1 py-0.5 rounded text-secondary-foreground font-mono text-sm" {...props}>
                    {children}
                  </code>
                ) : (
                  <pre className="bg-black/50 p-4 rounded-lg overflow-x-auto my-4 border border-border">
                    <code className="text-sm font-mono text-blue-300 block" {...props}>
                      {children}
                    </code>
                  </pre>
                );
            },
            a: ({node, ...props}) => <a className="text-primary hover:underline underline-offset-4 cursor-pointer" target="_blank" rel="noreferrer" {...props} />,
          }}
        >
          {content}
        </ReactMarkdown>
      </div>
    </ScrollArea>
  );
}
