// Type declarations for UI components
declare module '@/components/ui/pagination' {
  import React from 'react';
  
  export interface PaginationProps extends React.HTMLAttributes<HTMLDivElement> {
    children: React.ReactNode;
  }
  
  export function Pagination(props: PaginationProps): JSX.Element;
}

declare module '@/components/ui/use-toast' {
  import React from 'react';
  
  export interface ToastProps {
    variant?: "default" | "destructive";
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
    className?: string;
    children?: React.ReactNode;
    id?: string;
    title?: React.ReactNode;
    description?: React.ReactNode;
    action?: React.ReactElement;
  }
  
  export function toast(props: ToastProps): {
    id: string;
    dismiss: () => void;
    update: (props: Partial<ToastProps>) => void;
  };
  
  export function useToast(): {
    toasts: ToastProps[];
    toast: typeof toast;
    dismiss: (toastId?: string) => void;
    dismissAll: () => void;
  };
}
