"use client";

import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useDroppable } from "@dnd-kit/core";
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
  const { setNodeRef } = useDroppable({
    id: title, // Use the status key as the droppable ID
  });

  return (
    <div
      ref={setNodeRef}
      className="min-w-[300px] flex flex-col p-4"
      id={title}>
      <h2 className="font-black mb-4 flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] opacity-80 font-mono">
        <span className={`w-2 h-2 bg-neo-${color === 'white' ? 'white' : color} shadow-[0_0_8px_rgba(255,255,255,0.3)]`} />
        {title} <span className="opacity-30 ml-auto font-mono text-[9px]">[{tasks.length}]</span>
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
