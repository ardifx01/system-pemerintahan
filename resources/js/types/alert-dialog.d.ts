declare module '@/components/ui/alert-dialog' {
  import React from 'react';

  export const AlertDialog: React.FC<{ children: React.ReactNode; open?: boolean; onOpenChange?: (open: boolean) => void }>;
  export const AlertDialogTrigger: React.ForwardRefExoticComponent<React.HTMLAttributes<HTMLButtonElement> & React.RefAttributes<HTMLButtonElement>>;
  export const AlertDialogPortal: React.FC<{ children: React.ReactNode }>;
  export const AlertDialogOverlay: React.ForwardRefExoticComponent<React.HTMLAttributes<HTMLDivElement> & React.RefAttributes<HTMLDivElement>>;
  export const AlertDialogContent: React.ForwardRefExoticComponent<React.HTMLAttributes<HTMLDivElement> & React.RefAttributes<HTMLDivElement>>;
  export const AlertDialogHeader: React.FC<React.HTMLAttributes<HTMLDivElement>>;
  export const AlertDialogFooter: React.FC<React.HTMLAttributes<HTMLDivElement>>;
  export const AlertDialogTitle: React.ForwardRefExoticComponent<React.HTMLAttributes<HTMLHeadingElement> & React.RefAttributes<HTMLHeadingElement>>;
  export const AlertDialogDescription: React.ForwardRefExoticComponent<React.HTMLAttributes<HTMLParagraphElement> & React.RefAttributes<HTMLParagraphElement>>;
  export const AlertDialogAction: React.ForwardRefExoticComponent<React.ButtonHTMLAttributes<HTMLButtonElement> & React.RefAttributes<HTMLButtonElement>>;
  export const AlertDialogCancel: React.ForwardRefExoticComponent<React.ButtonHTMLAttributes<HTMLButtonElement> & React.RefAttributes<HTMLButtonElement>>;
}
