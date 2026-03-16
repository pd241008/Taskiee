import React from "react";

interface TaskBadgeProps {
  text: string;
  color: "purple" | "green" | "yellow" | "cyan" | "pink";
}

export const TaskBadge = ({ text, color }: TaskBadgeProps) => {
  const colorMap = {
    purple: "bg-neo-purple text-black",
    green: "bg-neo-green text-black",
    yellow: "bg-neo-yellow text-black",
    cyan: "bg-neo-cyan text-black",
    pink: "bg-neo-pink text-black",
  };

  return (
    <span
      className={`text-xs font-bold uppercase tracking-wider px-2 py-1 border-2 border-black ${colorMap[color]}`}>
      {text}
    </span>
  );
};
