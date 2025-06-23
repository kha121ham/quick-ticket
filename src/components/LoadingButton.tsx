'use client';

import { ReactNode } from "react";

type Props = {
  onClick?: (e: React.FormEvent) => void;
  loading: boolean;
  children: ReactNode;
  type?: 'button' | 'submit';
  className?: string;
  disabled?: boolean;
};

export default function LoadingButton({
  onClick,
  loading,
  children,
  type = 'button',
  className = '',
  disabled = false,
}: Props) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`flex items-center justify-center px-4 py-2 rounded ${className}`}
    >
      {loading ? (
        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
      ) : (
        children
      )}
    </button>
  );
}
