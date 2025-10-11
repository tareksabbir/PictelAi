import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Copy, Check, Code2 } from "lucide-react";
import SyntaxHighlighter from "react-syntax-highlighter";
import { atomOneDark } from "react-syntax-highlighter/dist/esm/styles/hljs";
import { toast } from "sonner";

interface ViewCodeBlockProps {
  children: React.ReactNode;
  code: string;
  language?: string;
  title?: string;
}

const ViewCodeBlock = ({ 
  children, 
  code, 
  language = "javascript",
  title = "Source Code"
}: ViewCodeBlockProps) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      toast.success("Code copied to clipboard!");
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast.error("Failed to copy code");
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="w-[90vw] min-w-7xl max-h-[85vh] flex flex-col p-0 overflow-hidden">
        <DialogHeader className="px-6 pt-6 pb-4 border-b">
          <DialogTitle className="flex items-center justify-between mt-5">
            <div className="flex items-center gap-2">
              <Code2 className="w-5 h-5 text-primary" />
              <span className="text-xl font-semibold">{title}</span>
            </div>
            <Button 
              onClick={handleCopy} 
              variant="outline"
              size="sm"
              className="gap-2"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  Copy Code
                </>
              )}
            </Button>
          </DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">
            View and copy the source code below
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex-1 overflow-auto px-6 pb-6 min-w-0">
          <div className="overflow-x-auto">
            <SyntaxHighlighter
              language={language}
              style={atomOneDark}
              customStyle={{
                fontSize: "0.875rem",
                borderRadius: "0.5rem",
                padding: "1.5rem",
                margin: 0,
                backgroundColor: "#282c34",
                width: "fit-content",
                minWidth: "100%",
              }}
              showLineNumbers
              wrapLines={false}
              lineNumberStyle={{
                minWidth: "3em",
                paddingRight: "1em",
                color: "#636d83",
                userSelect: "none",
              }}
            >
              {code}
            </SyntaxHighlighter>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ViewCodeBlock;