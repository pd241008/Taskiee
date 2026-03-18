"use client";

import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { BadgeColor } from "@/components/ui/TaskBadge";
import { SortableTask } from "./SortableTask";
import { Task } from "@/types/tasks";

export function KanbanColumn({
  title,
  tasks,
  color,
  onTaskClick,
  isAdmin,
  currentUserId,
}: {
  title: string;
  tasks: Task[];
  color: BadgeColor;
  onTaskClick: (task: Task) => void;
  isAdmin: boolean;
  currentUserId: string;
}) {
  return (
    <div
      className="min-w-[300px] flex flex-col"
      id={title}>
      <h2 className="font-black mb-3">
        {title} ({tasks.length})
      </h2>

      <SortableContext
        items={tasks.map((t) => t._id)}
        strategy={verticalListSortingStrategy}>
        <div className="space-y-3">
          {tasks.map((task) => (
            <SortableTask
              key={task._id}
              task={task}
              color={color}
              onClick={onTaskClick}
              disabled={!isAdmin && task.assignedTo?._id !== currentUserId}
            />
          ))}
        </div>
      </SortableContext>
    </div>
  );
}
