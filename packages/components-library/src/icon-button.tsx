import * as React from "react";

interface ButtonProps {
    children: React.ReactNode;
    className?: string;
    onClick: (...args: any[]) => any;
    variant?: "soft" | "classic";
}

export default function IconButton(props: ButtonProps) {
    const { children, className = "", onClick, variant = "classic" } = props;
    let commonClasses =
        "flex items-center gap-1 p-1 rounded disabled:pointer-events-none";

    if (variant === "classic") {
        commonClasses +=
            " bg-black text-white hover:!text-white hover:!bg-slate-500 active:!bg-slate-600 disabled:bg-slate-300";
    } else {
        commonClasses +=
            " bg-slate-100 text-black hover:!bg-slate-200 active:!bg-slate-300 disabled:text-slate-300";
    }

    return (
        <button className={`${commonClasses} ${className}`} onClick={onClick}>
            {children}
        </button>
    );
}