import React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "accent" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
  href?: string;
  target?: string;
  rel?: string;
  children: React.ReactNode;
  className?: string;
}

export const Button: React.FC<ButtonProps> = ({
  variant = "primary",
  size = "md",
  href,
  target,
  rel,
  children,
  className,
  ...props
}) => {
  const baseStyles =
    "inline-flex items-center justify-center font-medium rounded-lg transition-colors duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed select-none";

  const sizeStyles = {
    sm: "text-xs px-3 py-1.5 gap-1.5",
    md: "text-sm px-4 py-2.5 gap-2",
    lg: "text-base px-6 py-3 gap-2.5 font-semibold",
  };

  const variantStyles = {
    // Official Primary: Deep Navy Blue background with white text
    primary:
      "bg-brand-primary text-white hover:bg-brand-primary-hover active:bg-[#051c33] focus-visible:ring-brand-primary shadow-sm",
    // Official Secondary: White background with deep navy blue text and border
    secondary:
      "bg-white border-2 border-brand-primary text-brand-primary hover:bg-slate-50 active:bg-slate-100 focus-visible:ring-brand-primary shadow-sm",
    accent:
      "bg-brand-primary text-white hover:bg-brand-primary-hover active:bg-[#051c33] focus-visible:ring-brand-primary shadow-sm",
    outline:
      "bg-white border-2 border-brand-primary text-brand-primary hover:bg-brand-primary hover:text-white active:bg-brand-primary-hover focus-visible:ring-brand-primary shadow-sm",
    ghost:
      "text-brand-primary hover:bg-brand-primary/5 active:bg-brand-primary/10 focus-visible:ring-brand-primary",
  };

  const combinedClasses = cn(
    baseStyles,
    sizeStyles[size],
    variantStyles[variant],
    className
  );

  if (href) {
    const isExternal =
      href.startsWith("http") ||
      href.startsWith("tel:") ||
      href.startsWith("mailto:");
    if (isExternal) {
      return (
        <a
          href={href}
          target={target || (href.startsWith("http") ? "_blank" : undefined)}
          rel={
            rel || (href.startsWith("http") ? "noopener noreferrer" : undefined)
          }
          className={combinedClasses}
        >
          {children}
        </a>
      );
    }
    return (
      <Link href={href} className={combinedClasses}>
        {children}
      </Link>
    );
  }

  return (
    <button className={combinedClasses} {...props}>
      {children}
    </button>
  );
};

export default Button;
