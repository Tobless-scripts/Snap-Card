"use client";

import { PasswordFieldName } from "@/types/input";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";

export default function PasswordInput({
    value,
    action,
    name,
    placeholder,
}: PasswordFieldName) {
    const [show, setShow] = useState(false);

    return (
        <div className="relative">
            <input
                type={show ? "text" : "password"}
                name={name}
                value={value}
                onChange={action}
                placeholder={placeholder}
                autoComplete="new-password"
                className="w-full px-4 py-3 rounded border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
            />
            <button
                type="button"
                title={show ? "Hide password" : "Show password"}
                className="absolute right-3 top-3 cursor-pointer"
                onClick={() => setShow(!show)}
            >
                {show ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
        </div>
    );
}
