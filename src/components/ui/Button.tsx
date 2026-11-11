import React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "accent" | "outline" | "ghost";
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
    primary:
      "bg-ariiti-navy text-white hover:bg-ariiti-navy/90 active:bg-ariiti-navy/95 focus-visible:ring-ariiti-navy shadow-sm",
    accent:
      "bg-ariiti-accent text-white hover:bg-ariiti-accent/90 active:bg-ariiti-accent/95 focus-visible:ring-ariiti-accent shadow-sm",
    outline:
      "border-2 border-ariiti-navy text-ariiti-navy hover:bg-ariiti-navy hover:text-white active:bg-ariiti-navy/90 focus-visible:ring-ariiti-navy",
    ghost:
      "text-ariiti-navy hover:bg-ariiti-navy/5 active:bg-ariiti-navy/10 focus-visible:ring-ariiti-navy",
  };

  const combinedClasses = cn(
    baseStyles,
    sizeStyles[size],
    variantStyles[variant],
    className
  );

  if (href) {
    const isExternal = href.startsWith("http") || href.startsWith("tel:") || href.startsWith("mailto:");
    if (isExternal) {
      return (
        <a
          href={href}
          target={target || (href.startsWith("http") ? "_blank" : undefined)}
          rel={rel || (href.startsWith("http") ? "noopener noreferrer" : undefined)}
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
