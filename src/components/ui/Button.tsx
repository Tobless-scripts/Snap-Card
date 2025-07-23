import React from "react";
import { Loader2 } from "lucide-react";
import clsx from "clsx";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    loading?: boolean;
    variant?: "primary" | "secondary";
}

const Button: React.FC<ButtonProps> = ({
    loading = false,
    variant = "primary",
    children,
    className,
    disabled,
    ...props
}) => {
    const baseStyles =
        "flex items-center justify-center px-4 py-2 rounded-md font-semibold transition-colors cursor-pointer";
    const variantStyles =
        variant === "secondary"
            ? "bg-gray-200 text-black hover:bg-gray-300 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600"
            : "bg-black text-white hover:bg-gray-800";

    return (
        <button
            disabled={disabled || loading}
            className={clsx(baseStyles, variantStyles, className, {
                "cursor-not-allowed opacity-70": disabled || loading,
            })}
            {...props}
        >
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {children}
        </button>
    );
};

export default Button;
