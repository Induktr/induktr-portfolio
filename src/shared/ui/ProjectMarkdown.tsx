import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { cn } from "@/shared/lib/utils";

interface ProjectMarkdownProps {
  content: string;
  className?: string;
}

const markdownComponents = {
  h1: ({node, ...props}: any) => (
    <h1 className="text-3xl font-bold text-primary mb-6 pb-2 border-b border-white/10" {...props} />
  ),
  h2: ({node, ...props}: any) => (
    <h2 className="text-2xl font-bold text-foreground mt-8 mb-4 flex items-center gap-2" {...props} />
  ),
  table: ({node, ...props}: any) => (
    <div className="overflow-x-auto my-6 rounded-lg border border-white/10">
      <table className="w-full text-left bg-black/20" {...props} />
    </div>
  ),
  th: ({node, ...props}: any) => (
    <th className="bg-primary/10 p-3 font-bold text-primary border-b border-white/10" {...props} />
  ),
  td: ({node, ...props}: any) => (
    <td className="p-3 border-b border-white/5" {...props} />
  ),
  blockquote: ({node, ...props}: any) => (
    <blockquote className="border-l-4 border-primary pl-4 py-1 italic bg-primary/5 rounded-r my-4" {...props} />
  ),
  code: ({node, className, children, ...props}: any) => {
    const match = /language-(\w+)/.exec(className || '')
    const isInline = !String(children).includes('\n');

    return isInline ? (
      <code className="bg-primary/20 text-primary px-1.5 py-0.5 rounded text-sm font-mono" {...props}>
        {children}
      </code>
    ) : (
      <div className="relative group">
        <div className="absolute top-2 right-2 text-xs text-muted-foreground bg-black/50 px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
          {match?.[1] || 'text'}
        </div>
        <code className="block bg-black/40 p-4 rounded-lg my-4 overflow-x-auto text-sm font-mono border border-white/5" {...props}>
          {children}
        </code>
      </div>
    );
  }
};

export function ProjectMarkdown({ content, className }: ProjectMarkdownProps) {
  return (
    <div className={cn("prose prose-invert max-w-none", className)}>
      <ReactMarkdown remarkPlugins={[remarkGfm]} components={markdownComponents}>
        {content}
      </ReactMarkdown>
    </div>
  );
}
