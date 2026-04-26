import React from "react";

interface TaskButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  color?: "purple" | "green" | "yellow" | "cyan" | "white";
}

export const TaskButton = ({
  children,
  color = "purple",
  ...props
}: TaskButtonProps) => {
  const colorMap = {
    purple: "bg-neo-purple hover:bg-neo-pink",
    green: "bg-neo-green hover:bg-neo-yellow",
    yellow: "bg-neo-yellow hover:bg-neo-green",
    cyan: "bg-neo-cyan hover:bg-neo-purple",
    white: "bg-neo-white-hover:bg-neo-white",
  };

  return (
    <button
      className={`border-2 border-white px-6 py-2 font-bold uppercase tracking-wide text-black transition-all transform active:translate-x-1 active:translate-y-1 shadow-neo-white hover:shadow-none ${colorMap[color]}`}
      {...props}>
      {children}
    </button>
  );
};
