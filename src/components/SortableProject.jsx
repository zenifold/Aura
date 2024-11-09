import React from 'react';
import ProjectHeader from './ProjectHeader';
import TaskListItem from './TaskListItem';
import { useTheme } from '../hooks/useTheme';

const SortableProject = ({
  project,
  tasks,
  onUpdateProject,
  onDeleteProject,
  addingTaskForProject,
  newTaskTitle,
  setNewTaskTitle,
  handleAddTaskClick,
  handleCancelAddTask,
  onMoveUp,
  onMoveDown,
  isFirst,
  isLast,
  children,
  onAddTask
}) => {
  const [isCollapsed, setIsCollapsed] = React.useState(project.isCollapsed || false);
  const { theme } = useTheme();

  const handleUpdateTask = (taskId, updatedTask) => {
    const updatedColumns = project.columns.map(column => ({
      ...column,
      tasks: column.tasks.map(task => 
        task.id === taskId ? { ...task, ...updatedTask } : task
      )
    }));

    onUpdateProject({
      ...project,
      columns: updatedColumns
    });
  };

  const handleToggleCollapse = () => {
    const newCollapsedState = !isCollapsed;
    setIsCollapsed(newCollapsedState);
    onUpdateProject({
      ...project,
      isCollapsed: newCollapsedState
    });
  };

  // Calculate total tasks for the project
  const totalTasks = tasks ? tasks.length : project.columns.reduce((total, column) => total + column.tasks.length, 0);

  return (
    <div className="bg-white dark:bg-dark-card rounded-xl shadow-aura border border-surface-200 
      dark:border-dark-border relative overflow-visible transition-all duration-200 
      hover:shadow-aura-md dark:hover:shadow-none">
      <ProjectHeader
        project={{
          ...project,
          totalTasks
        }}
        onUpdateProject={onUpdateProject}
        onDeleteProject={onDeleteProject}
        onAddTask={onAddTask}
        onMoveUp={onMoveUp}
        onMoveDown={onMoveDown}
        isFirst={isFirst}
        isLast={isLast}
        className="border-b border-surface-200 dark:border-dark-border"
        isCollapsed={isCollapsed}
        onToggleCollapse={handleToggleCollapse}
      />

      {!isCollapsed && (
        <>
          {addingTaskForProject === project.id && (
            <div className="p-5 border-b border-surface-200 dark:border-dark-border 
              bg-surface-50/50 dark:bg-dark-hover/30 transition-colors duration-200">
              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  type="text"
                  value={newTaskTitle}
                  onChange={(e) => setNewTaskTitle(e.target.value)}
                  placeholder="Enter task title..."
                  className="flex-1 px-3 py-2 border border-surface-200 dark:border-dark-border rounded-lg 
                    focus:outline-none focus:ring-2 focus:ring-aura-200 dark:focus:ring-aura-500/30 
                    focus:border-aura-500 dark:focus:border-aura-500 text-surface-700 dark:text-dark-text 
                    placeholder-surface-400 dark:placeholder-dark-text/60 bg-white dark:bg-dark-hover
                    transition-all duration-200"
                  autoFocus
                />
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      if (newTaskTitle.trim()) {
                        onAddTask(project.columns[0].id, newTaskTitle);
                        handleCancelAddTask();
                      }
                    }}
                    className={`px-4 py-2 ${theme.colors.primary} text-white rounded-lg hover:opacity-90 
                      flex-1 sm:flex-none font-medium shadow-sm hover:shadow dark:shadow-none
                      transition-all duration-200`}
                  >
                    Add Task
                  </button>
                  <button
                    onClick={handleCancelAddTask}
                    className="px-4 py-2 bg-surface-100 dark:bg-dark-hover text-surface-600 dark:text-dark-text 
                      rounded-lg hover:bg-surface-200 dark:hover:bg-dark-border hover:text-surface-700 
                      dark:hover:text-white flex-1 sm:flex-none font-medium transition-colors duration-200"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}

          <div className="divide-y divide-surface-100 dark:divide-dark-border">
            {/* List View: Render tasks directly */}
            {tasks ? (
              tasks.length > 0 ? (
                tasks.map(task => (
                  <div key={task.id} className="p-4">
                    <TaskListItem
                      task={task}
                      onUpdateTask={(updatedTask) => handleUpdateTask(task.id, updatedTask)}
                      projectColor={project.color}
                    />
                  </div>
                ))
              ) : (
                <div className="p-4 text-surface-500 dark:text-dark-text/60 text-sm text-center">
                  No tasks in this project
                </div>
              )
            ) : (
              /* Board View: Render children (columns) */
              children
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default SortableProject;
