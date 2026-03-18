"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { TaskCard } from "@/components/ui/TaskCard";
import { TaskBadge, BadgeColor } from "@/components/ui/TaskBadge";
import { Task } from "@/types/tasks";

const mapCardColor = (color: BadgeColor) => {
  if (color === "gray") return "white";
  return color;
};

export function SortableTask({
  task,
  color,
  onClick,
  disabled = false,
}: {
  task: Task;
  color: BadgeColor;
  onClick: (task: Task) => void;
  disabled?: boolean;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: task._id, disabled });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      onClick={() => onClick(task)}
      className={`cursor-pointer ${isDragging ? "opacity-30" : ""}`}>
      <TaskCard color={mapCardColor(color)}>
        <TaskBadge
          text={task.status}
          color={color}
        />
        <h3 className="font-bold mt-2">{task.title}</h3>
        <p className="text-xs text-gray-400 line-clamp-2">{task.description}</p>
      </TaskCard>
    </div>
  );
}
