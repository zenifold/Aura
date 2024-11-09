import React from 'react';
import { Settings, GripVertical } from 'lucide-react';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

const defaultColumns = [
  { id: 'title', label: 'Title', required: true },
  { id: 'status', label: 'Status' },
  { id: 'priority', label: 'Priority' },
  { id: 'dueDate', label: 'Due Date' },
  { id: 'labels', label: 'Labels' },
  { id: 'tags', label: 'Tags' },
  { id: 'project', label: 'Project' }
];

const SortableColumnItem = ({ column, isActive, onToggle }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id: column.id, disabled: column.required });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`flex items-center gap-2 px-2 py-1.5 rounded-md cursor-pointer text-sm
        ${isDragging ? 'bg-surface-100 dark:bg-dark-hover' : 'hover:bg-surface-50 dark:hover:bg-dark-hover'}`}
    >
      {!column.required && (
        <div {...attributes} {...listeners} className="cursor-grab active:cursor-grabbing">
          <GripVertical size={14} className="text-surface-400 dark:text-dark-text/50" />
        </div>
      )}
      
      <label className="flex items-center gap-2 flex-1">
        <input
          type="checkbox"
          checked={isActive}
          onChange={() => onToggle(column.id)}
          disabled={column.required}
          className="rounded border-surface-300 dark:border-dark-border text-aura-600 
            focus:ring-aura-500 dark:focus:ring-aura-400 focus:ring-offset-0"
        />
        <span className="text-surface-700 dark:text-dark-text">{column.label}</span>
      </label>

      {column.required && (
        <span className="text-xs text-surface-400 dark:text-dark-text/50 ml-auto">
          Required
        </span>
      )}
    </div>
  );
};

const ListViewColumns = ({ activeColumns, onToggleColumn, columnOrder, onReorder }) => {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = columnOrder.indexOf(active.id);
      const newIndex = columnOrder.indexOf(over.id);
      onReorder(oldIndex, newIndex);
    }
  };

  return (
    <div className="relative group">
      <button
        className="p-2 hover:bg-surface-100 dark:hover:bg-dark-hover rounded-lg transition-colors"
        aria-label="Configure columns"
      >
        <Settings size={16} className="text-surface-600 dark:text-dark-text/70" />
      </button>
      
      <div className="absolute right-0 top-full mt-1 bg-white dark:bg-dark-card rounded-lg 
        shadow-aura-lg dark:shadow-none border border-surface-200 dark:border-dark-border p-2 
        min-w-[200px] opacity-0 invisible group-hover:opacity-100 group-hover:visible 
        transition-all duration-200 z-10">
        <div className="text-sm font-medium text-surface-600 dark:text-dark-text/70 px-2 py-1.5 
          border-b border-surface-100 dark:border-dark-border">
          Configure Columns
        </div>

        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={columnOrder}
            strategy={verticalListSortingStrategy}
          >
            <div className="space-y-1 mt-2">
              {columnOrder.map(columnId => {
                const column = defaultColumns.find(col => col.id === columnId);
                if (!column) return null;

                return (
                  <SortableColumnItem
                    key={column.id}
                    column={column}
                    isActive={activeColumns.includes(column.id)}
                    onToggle={onToggleColumn}
                  />
                );
              })}
            </div>
          </SortableContext>
        </DndContext>
      </div>
    </div>
  );
};

export { defaultColumns };
export default ListViewColumns;
