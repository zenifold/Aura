import React from 'react';
import { Calendar, ClipboardList } from 'lucide-react';
import TaskDialog from './TaskDialog';
import { useTaskActions } from '../hooks/useTaskActions';

const TaskList = ({ 
  tasks = [], 
  project, 
  onUpdateTask, 
  onStatusChange,
  availableStatuses = [],
  onAddTask
}) => {
  const {
    selectedTask,
    isDialogOpen,
    handleTaskClick,
    handleTaskDialogClose,
  } = useTaskActions();

  if (tasks.length === 0) {
    return (
      <div className="p-8 text-center text-gray-500">
        <ClipboardList size={24} className="mx-auto mb-2" />
        <p>No tasks yet</p>
        <button
          onClick={onAddTask}
          className="mt-2 text-sm text-blue-600 hover:text-blue-700"
        >
          Add your first task
        </button>
      </div>
    );
  }

  return (
    <>
      <div className="divide-y">
        {tasks.map(task => (
          <div 
            key={task.id} 
            className="flex flex-col sm:flex-row sm:items-center gap-4 p-4 hover:bg-gray-50 cursor-pointer"
            onClick={() => handleTaskClick(task)}
          >
            <div className="flex-1">
              <div className="font-medium">{task.title}</div>
              <div className="text-sm text-gray-500">
                {task.mainStatus}
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
              {task.dueDate && (
                <div className="flex items-center gap-1">
                  <Calendar size={16} />
                  {new Date(task.dueDate).toLocaleDateString()}
                </div>
              )}

              {task.tags?.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {task.tags.map(tag => (
                    <span key={tag} className="px-2 py-1 bg-gray-100 rounded-full text-xs">
                      {tag}
                    </span>
                  ))}
                </div>
              )}

              <select
                value={task.mainStatus}
                onChange={(e) => {
                  e.stopPropagation();
                  onStatusChange(task, e.target.value);
                }}
                className="px-2 py-1 border rounded-lg text-sm w-full sm:w-auto"
                onClick={(e) => e.stopPropagation()}
              >
                {availableStatuses.map(status => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </div>
          </div>
        ))}
      </div>

      {selectedTask && (
        <TaskDialog
          task={selectedTask}
          isOpen={isDialogOpen}
          onClose={handleTaskDialogClose}
          onUpdate={onUpdateTask}
        />
      )}
    </>
  );
};

export default TaskList;
