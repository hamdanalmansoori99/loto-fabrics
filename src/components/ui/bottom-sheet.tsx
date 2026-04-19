"use client";

import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

interface BottomSheetProps {
  trigger: ReactNode;
  title?: string;
  children: ReactNode;
  footer?: ReactNode;
  contentClassName?: string;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

/**
 * Mobile bottom sheet — wraps shadcn Sheet with side="bottom", adds:
 * - Grabber handle at top
 * - Optional sticky footer for apply/reset actions
 * - Max 90vh height with internal scroll
 * - Safe-area-inset aware
 */
export function BottomSheet({
  trigger,
  title,
  children,
  footer,
  contentClassName,
  open,
  onOpenChange,
}: BottomSheetProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetTrigger render={<>{trigger}</>} />
      <SheetContent
        side="bottom"
        showCloseButton={false}
        className={cn(
          "bg-background text-foreground rounded-t-[20px] border-t-0 max-h-[90vh] p-0 flex flex-col",
          contentClassName
        )}
      >
        {/* Grabber */}
        <div className="flex justify-center pt-3 pb-1 shrink-0">
          <SheetClose className="w-10 h-1 rounded-full bg-border hover:bg-pink-salt-dark transition-colors" aria-label="Close" />
        </div>

        {title && (
          <div className="px-5 pb-3 pt-1 shrink-0 border-b border-border/50">
            <h2 className="display-sm text-foreground">{title}</h2>
          </div>
        )}

        {/* Scroll area */}
        <div className="flex-1 overflow-y-auto px-5 py-4">{children}</div>

        {/* Sticky footer */}
        {footer && (
          <div className="shrink-0 border-t border-border/50 p-4 pb-[max(1rem,env(safe-area-inset-bottom))] bg-background">
            {footer}
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
