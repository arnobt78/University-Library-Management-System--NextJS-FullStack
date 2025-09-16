"use client";

import { Button } from "@/components/ui/button";
import { Copy } from "lucide-react";

interface CopyButtonProps {
  text: string;
  className?: string;
}

export const CopyButton = ({ text, className }: CopyButtonProps) => {
  const copyToClipboard = () => {
    navigator.clipboard.writeText(text);
  };

  return (
    <Button
      size="sm"
      variant="outline"
      onClick={copyToClipboard}
      className={className}
    >
      <Copy className="size-4" />
    </Button>
  );
};
