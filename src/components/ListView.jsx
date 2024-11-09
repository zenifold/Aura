import React from 'react';
import { ArrowUpDown, Filter, SortAsc, Calendar, Tag } from 'lucide-react';
import TaskListItem from './TaskListItem';
import ListViewColumns, { defaultColumns } from './ListViewColumns';
import { useListView } from '../hooks/useListView';
import { useTaskActions } from '../hooks/useTaskActions';

const ListView = ({ 
  projects = [], 
  onUpdateProject, 
  onDeleteProject,
  onMoveUp,
  onMoveDown,
  allTasks = []
}) => {
  const {
    sortBy,
    sortDirection,
    groupBy,
    setGroupBy,
    handleSort,
    groupedTasks,
    availableStatuses,
    activeColumns,
    toggleColumn,
    columnOrder,
    orderedActiveColumns,
    handleColumnReorder,
    _debug
  } = useListView(projects);

  const {
    newTaskTitle,
    setNewTaskTitle,
    addingTaskForProject,
    handleAddTaskClick,
    handleCancelAddTask
  } = useTaskActions();

  const handleUpdateTask = (projectId, taskId, updatedTask) => {
    const project = projects.find(p => p.id === projectId);
    if (!project) return;

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

  // Get all available labels from all projects
  const allLabels = projects.reduce((acc, project) => {
    if (project.labels) {
      acc.push(...project.labels);
    }
    return acc;
  }, []);

  // If there are no tasks, show a message
  if (!allTasks || allTasks.length === 0) {
    return (
      <div className="bg-white dark:bg-dark-card rounded-xl shadow-aura dark:shadow-none 
        border border-surface-200 dark:border-dark-border p-8 text-center">
        <p className="text-surface-600 dark:text-dark-text/80 text-lg">
          No tasks found. Create a task in any project to see it here.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6 px-2 sm:px-6 py-4">
      {/* Controls */}
      <div className="bg-white dark:bg-dark-card rounded-xl shadow-aura dark:shadow-none 
        border border-surface-200 dark:border-dark-border">
        <div className="p-2 sm:p-4 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full sm:w-auto">
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <Filter size={16} className="text-aura-500 shrink-0" />
              <select 
                value={groupBy}
                onChange={(e) => setGroupBy(e.target.value)}
                className="w-full sm:w-auto border border-surface-200 dark:border-dark-border rounded-lg px-3 py-2
                  text-surface-700 dark:text-dark-text bg-white dark:bg-dark-hover
                  focus:outline-none focus:ring-2 focus:ring-aura-200 dark:focus:ring-aura-500/30 
                  focus:border-aura-500 dark:focus:border-aura-500
                  transition-shadow duration-200"
              >
                <option value="project">Group by Project</option>
                <option value="status">Group by Status</option>
                <option value="dueDate">Group by Due Date</option>
                <option value="none">No Grouping</option>
              </select>
            </div>

            <div className="hidden sm:block h-6 w-px bg-surface-200 dark:bg-dark-border" />

            <div className="flex flex-wrap gap-2">
              {defaultColumns.map(column => (
                <button
                  key={column.id}
                  onClick={() => handleSort(column.id)}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium
                    transition-colors duration-200 shrink-0
                    ${sortBy === column.id 
                      ? 'bg-aura-50 dark:bg-aura-500/20 text-aura-600 dark:text-aura-400' 
                      : 'text-surface-600 dark:text-dark-text hover:text-aura-600 dark:hover:text-aura-400 hover:bg-aura-50 dark:hover:bg-aura-500/20'}`}
                >
                  <SortAsc 
                    size={14} 
                    className={sortBy === column.id && sortDirection === 'desc' ? 'rotate-180' : ''} 
                  />
                  {column.label}
                </button>
              ))}
            </div>
          </div>

          <div className="hidden sm:block">
            <ListViewColumns 
              activeColumns={activeColumns}
              onToggleColumn={toggleColumn}
              columnOrder={columnOrder}
              onReorder={handleColumnReorder}
            />
          </div>
        </div>
      </div>

      {/* Task Groups */}
      <div className="space-y-6">
        {Object.entries(groupedTasks).map(([group, tasks]) => (
          <div key={group} className="bg-white dark:bg-dark-card rounded-xl shadow-aura dark:shadow-none 
            border border-surface-200 dark:border-dark-border overflow-hidden">
            <div className="p-4 border-b border-surface-200 dark:border-dark-border">
              <div className="flex items-center gap-3">
                <div className="h-2 w-2 rounded-full bg-aura-500" />
                <h2 className="text-lg font-semibold text-surface-800 dark:text-dark-text">{group}</h2>
                <span className="text-sm text-surface-500 dark:text-dark-text/60">
                  {tasks.length} {tasks.length === 1 ? 'task' : 'tasks'}
                </span>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[640px]">
                <thead>
                  <tr className="border-b border-surface-200 dark:border-dark-border bg-surface-50 dark:bg-dark-hover">
                    {orderedActiveColumns.map(columnId => {
                      const column = defaultColumns.find(col => col.id === columnId);
                      if (!column) return null;
                      return (
                        <th key={column.id} className="text-left p-3 text-sm font-medium text-surface-600 dark:text-dark-text/80 whitespace-nowrap">
                          {column.label}
                        </th>
                      );
                    })}
                  </tr>
                </thead>
                <tbody className="divide-y divide-surface-100 dark:divide-dark-border">
                  {tasks.map(task => {
                    const project = projects.find(p => p.id === task.projectId);
                    
                    return (
                      <TaskListItem
                        key={task.id}
                        task={task}
                        onUpdateTask={(updatedTask) => handleUpdateTask(task.projectId, task.id, updatedTask)}
                        projectColor={project?.color}
                        showProject={groupBy !== 'project'}
                        availableTasks={allTasks}
                        availableLabels={allLabels}
                        activeColumns={orderedActiveColumns}
                      />
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ListView;
