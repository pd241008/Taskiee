import React from "react";

interface TaskCardProps {
  children: React.ReactNode;
  color?: "purple" | "green" | "yellow" | "cyan" | "pink" | "white";
  className?: string;
}

export const TaskCard = ({
  children,
  color = "purple",
  className = "",
}: TaskCardProps) => {
  const shadowMap = {
    purple: "shadow-neo-purple hover:shadow-neo-pink",
    green: "shadow-neo-green hover:shadow-neo-yellow",
    yellow: "shadow-neo-yellow hover:shadow-neo-green",
    cyan: "shadow-neo-cyan hover:shadow-neo-purple",
    pink: "shadow-neo-pink hover:shadow-neo-cyan",
    white: "shadow-neo-white hover:shadow-neo-purple",
  };

  return (
    <div
      className={`bg-neo-card border-2 border-white p-6 transition-all duration-300 ${shadowMap[color]} ${className}`}>
      {children}
    </div>
  );
};
