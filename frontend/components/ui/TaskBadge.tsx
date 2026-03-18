import React from "react";

const colorMap = {
  purple: "bg-neo-purple text-black",
  green: "bg-neo-green text-black",
  yellow: "bg-neo-yellow text-black",
  cyan: "bg-neo-cyan text-black",
  pink: "bg-neo-pink text-black",
  gray: "bg-gray-400 text-black",
  white: "bg-white text-black",
} as const;

// ✅ EXPORT THIS (IMPORTANT)
export type BadgeColor = keyof typeof colorMap;

interface TaskBadgeProps {
  text: string;
  color: BadgeColor;
}

export const TaskBadge = ({ text, color }: TaskBadgeProps) => {
  return (
    <span className={`px-2 py-1 text-xs font-bold ${colorMap[color]}`}>
      {text}
    </span>
  );
};
