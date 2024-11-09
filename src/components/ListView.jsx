import React, { useState } from 'react';
import { ArrowUpDown, Filter, SortAsc, Calendar, Tag, Plus, FolderPlus } from 'lucide-react';
import TaskListItem from './TaskListItem';
import ListViewColumns, { defaultColumns } from './ListViewColumns';
import { useListView } from '../hooks/useListView';
import { useTaskActions } from '../hooks/useTaskActions';
import TaskDialog from './TaskDialog';
import { useTheme } from '../hooks/useTheme';

const ListView = ({ 
  projects = [], 
  onUpdateProject, 
  onDeleteProject,
  onMoveUp,
  onMoveDown,
  allTasks = [],
  onCreateProject,
  onCreateTask
}) => {
  const { theme } = useTheme();
  const [isTaskDialogOpen, setIsTaskDialogOpen] = useState(false);
  const [selectedProjectId, setSelectedProjectId] = useState(null);

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

  // Show empty state only when there are no tasks in _debug.allTasks
  if (_debug.allTasks.length === 0) {
    return (
      <div className="bg-white dark:bg-dark-card rounded-xl shadow-aura dark:shadow-none 
        border border-surface-200 dark:border-dark-border p-8 text-center">
        <div className="max-w-md mx-auto space-y-6">
          <div className="space-y-2">
            <h3 className="text-xl font-semibold text-surface-800 dark:text-dark-text">
              No tasks yet
            </h3>
            <p className="text-surface-600 dark:text-dark-text/80">
              Create your first task or start a new project to get organized
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {projects.length > 0 && (
              <div className="flex-1">
                <select
                  onChange={(e) => {
                    setSelectedProjectId(e.target.value);
                    setIsTaskDialogOpen(true);
                  }}
                  className="w-full px-4 py-2 bg-white dark:bg-dark-hover border border-surface-200 
                    dark:border-dark-border rounded-lg text-surface-800 dark:text-dark-text
                    focus:outline-none focus:ring-2 focus:ring-aura-200 dark:focus:ring-aura-500/30"
                  defaultValue=""
                >
                  <option value="" disabled>Select a project</option>
                  {projects.map(project => (
                    <option key={project.id} value={project.id}>
                      {project.title}
                    </option>
                  ))}
                </select>
              </div>
            )}
            
            <button
              onClick={() => onCreateProject()}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2 
                bg-surface-100 dark:bg-dark-hover hover:bg-surface-200 
                dark:hover:bg-dark-hover/70 text-surface-800 dark:text-dark-text 
                rounded-lg transition-colors duration-200"
            >
              <FolderPlus size={20} />
              New Project
            </button>
          </div>
        </div>
      </div>
    );
  }

  const getColumnWidth = (columnId) => {
    const column = defaultColumns.find(col => col.id === columnId);
    return column?.width || 'auto';
  };

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
        {Object.entries(groupedTasks).map(([group, tasks]) => {
          const projectId = tasks[0]?.projectId;
          return (
            <div key={group} className="bg-white dark:bg-dark-card rounded-xl shadow-aura dark:shadow-none 
              border border-surface-200 dark:border-dark-border overflow-hidden">
              <div className="p-4 border-b border-surface-200 dark:border-dark-border">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-2 w-2 rounded-full bg-aura-500" />
                    <h2 className="text-lg font-semibold text-surface-800 dark:text-dark-text">{group}</h2>
                    <span className="text-sm text-surface-500 dark:text-dark-text/60">
                      {tasks.length} {tasks.length === 1 ? 'task' : 'tasks'}
                    </span>
                  </div>
                  {groupBy === 'project' && projectId && (
                    <button
                      onClick={() => {
                        setSelectedProjectId(projectId);
                        setIsTaskDialogOpen(true);
                      }}
                      className="p-1.5 rounded-lg hover:bg-surface-100 dark:hover:bg-dark-hover
                        text-surface-600 dark:text-dark-text/80 hover:text-aura-600 dark:hover:text-aura-400
                        transition-colors duration-200"
                      title="Add task"
                    >
                      <Plus size={16} />
                    </button>
                  )}
                </div>
              </div>

              <div className="overflow-x-auto">
                <div className="min-w-full table">
                  <div className="table-header-group">
                    <div className="table-row border-b border-surface-200 dark:border-dark-border bg-surface-50 dark:bg-dark-hover">
                      {orderedActiveColumns.map(columnId => {
                        const column = defaultColumns.find(col => col.id === columnId);
                        if (!column) return null;
                        return (
                          <div key={column.id} 
                            className="table-cell text-left p-3 text-sm font-medium text-surface-600 dark:text-dark-text/80 whitespace-nowrap"
                            style={{ width: getColumnWidth(column.id) }}
                          >
                            {column.label}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                  <div className="table-row-group divide-y divide-surface-100 dark:divide-dark-border">
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
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {isTaskDialogOpen && (
        <TaskDialog
          task={{}}
          isOpen={isTaskDialogOpen}
          onClose={() => {
            setIsTaskDialogOpen(false);
            setSelectedProjectId(null);
          }}
          onUpdate={(taskData) => {
            if (selectedProjectId) {
              onCreateTask(selectedProjectId, taskData);
            }
            setIsTaskDialogOpen(false);
            setSelectedProjectId(null);
          }}
          availableLabels={allLabels}
          availableTasks={allTasks}
          availableColumns={
            projects.find(p => p.id === selectedProjectId)?.columns || []
          }
        />
      )}
    </div>
  );
};

export default ListView;
