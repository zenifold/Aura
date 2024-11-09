import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, List, Calendar as CalendarIcon } from 'lucide-react';
import TimelineGrid from './TimelineGrid';
import TaskDialog from './TaskDialog';
import { useDialog } from '../hooks/useDialog';

const CalendarView = ({ projects, onUpdateProject, onDeleteProject, allTasks }) => {
  console.log('CalendarView rendering with tasks:', allTasks);

  const [viewType, setViewType] = useState('week');
  const [currentDate, setCurrentDate] = useState(new Date());
  const [displayMode, setDisplayMode] = useState('timeline');
  const { isOpen: isTaskDialogOpen, open: openTaskDialog, close: closeTaskDialog } = useDialog();
  const [selectedTask, setSelectedTask] = useState(null);
  const [isNewTask, setIsNewTask] = useState(false);

  const handleTaskClick = (task) => {
    const originalTask = allTasks.find(t => t.id === task.id);
    console.log('Task clicked:', originalTask);
    setSelectedTask(originalTask);
    setIsNewTask(false);
    openTaskDialog();
  };

  const handleAddTask = (projectId) => {
    console.log('Adding new task for project:', projectId);
    const project = projects.find(p => p.id === projectId);
    if (!project) return;

    // Create a new task with minimal default values
    const newTask = {
      id: `task-${Date.now()}`,
      title: '',
      projectId,
      projectTitle: project.title,
      startDate: new Date().toISOString(),
      dueDate: null,
      mainStatus: 'to do',
      hierarchyType: 'task',
      relationships: []
    };

    setSelectedTask(newTask);
    setIsNewTask(true);
    openTaskDialog();
  };

  const formatDateRange = () => {
    const options = { month: 'long', day: 'numeric', year: 'numeric' };
    switch (viewType) {
      case 'day':
        return currentDate.toLocaleDateString(undefined, options);
      case 'week': {
        const weekStart = new Date(currentDate);
        weekStart.setDate(currentDate.getDate() - currentDate.getDay());
        const weekEnd = new Date(weekStart);
        weekEnd.setDate(weekStart.getDate() + 6);
        return `${weekStart.toLocaleDateString(undefined, { month: 'long', day: 'numeric' })} - ${weekEnd.toLocaleDateString(undefined, options)}`;
      }
      case 'month':
        return currentDate.toLocaleDateString(undefined, { month: 'long', year: 'numeric' });
      default:
        return '';
    }
  };

  const navigateDate = (direction) => {
    const newDate = new Date(currentDate);
    switch (viewType) {
      case 'day':
        newDate.setDate(newDate.getDate() + direction);
        break;
      case 'week':
        newDate.setDate(newDate.getDate() + (direction * 7));
        break;
      case 'month':
        newDate.setMonth(newDate.getMonth() + direction);
        break;
    }
    setCurrentDate(newDate);
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  // Map tasks and set today's date for tasks without dates
  const timelineTasks = allTasks.map(task => {
    // If task has no dates, set both start and due date to today
    if (!task.startDate && !task.dueDate) {
      const today = new Date().toISOString();
      return {
        ...task,
        startDate: today,
        dueDate: today
      };
    }

    // Ensure dates are properly formatted
    const startDate = task.startDate ? new Date(task.startDate).toISOString() : null;
    const dueDate = task.dueDate ? new Date(task.dueDate).toISOString() : null;

    // Create simplified task with required properties
    return {
      id: task.id,
      title: task.title,
      startDate,
      dueDate,
      projectId: task.projectId,
      projectTitle: task.projectTitle,
      priority: task.priority || null,
      mainStatus: task.mainStatus || 'to do',
      hierarchyType: task.hierarchyType || 'task',
      hasRelationships: Array.isArray(task.relationships) && task.relationships.length > 0,
      relationshipIds: Array.isArray(task.relationships) 
        ? task.relationships.map(r => r.id || r.taskId)
        : []
    };
  });

  console.log('Timeline tasks:', timelineTasks);

  const handleTaskUpdate = (updatedTask) => {
    console.log('Updating task:', updatedTask);
    const project = projects.find(p => p.id === updatedTask.projectId);
    if (!project) return;

    // For new tasks, add to the first column
    if (isNewTask && project.columns.length > 0) {
      const updatedProject = {
        ...project,
        columns: project.columns.map((column, index) => ({
          ...column,
          tasks: index === 0 ? [...column.tasks, updatedTask] : column.tasks
        }))
      };
      onUpdateProject(updatedProject);
    } else {
      // For existing tasks, update in place
      const updatedProject = {
        ...project,
        columns: project.columns.map(column => ({
          ...column,
          tasks: column.tasks.map(task => 
            task.id === updatedTask.id ? updatedTask : task
          )
        }))
      };
      onUpdateProject(updatedProject);
    }

    closeTaskDialog();
  };

  return (
    <div className="bg-white dark:bg-dark-card rounded-xl shadow-aura border 
      border-surface-200 dark:border-dark-border transition-colors duration-200">
      <div className="p-4 border-b border-surface-200 dark:border-dark-border">
        <div className="flex justify-between items-center">
          <div className="flex space-x-4">
            <button 
              onClick={() => setViewType('day')}
              className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors
                ${viewType === 'day' 
                  ? 'bg-aura-100 text-aura-600 dark:bg-aura-500/20 dark:text-aura-400' 
                  : 'text-surface-600 dark:text-dark-text hover:bg-surface-100 dark:hover:bg-dark-hover'
                }`}
            >
              Day
            </button>
            <button 
              onClick={() => setViewType('week')}
              className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors
                ${viewType === 'week'
                  ? 'bg-aura-100 text-aura-600 dark:bg-aura-500/20 dark:text-aura-400'
                  : 'text-surface-600 dark:text-dark-text hover:bg-surface-100 dark:hover:bg-dark-hover'
                }`}
            >
              Week
            </button>
            <button 
              onClick={() => setViewType('month')}
              className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors
                ${viewType === 'month'
                  ? 'bg-aura-100 text-aura-600 dark:bg-aura-500/20 dark:text-aura-400'
                  : 'text-surface-600 dark:text-dark-text hover:bg-surface-100 dark:hover:bg-dark-hover'
                }`}
            >
              Month
            </button>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex border border-surface-200 dark:border-dark-border rounded-lg overflow-hidden">
              <button
                onClick={() => setDisplayMode('timeline')}
                className={`p-2 transition-colors ${
                  displayMode === 'timeline'
                    ? 'bg-aura-100 text-aura-600 dark:bg-aura-500/20 dark:text-aura-400'
                    : 'text-surface-600 dark:text-dark-text hover:bg-surface-100 dark:hover:bg-dark-hover'
                }`}
              >
                <CalendarIcon size={18} />
              </button>
              <button
                onClick={() => setDisplayMode('list')}
                className={`p-2 transition-colors ${
                  displayMode === 'list'
                    ? 'bg-aura-100 text-aura-600 dark:bg-aura-500/20 dark:text-aura-400'
                    : 'text-surface-600 dark:text-dark-text hover:bg-surface-100 dark:hover:bg-dark-hover'
                }`}
              >
                <List size={18} />
              </button>
            </div>
            <button
              onClick={goToToday}
              className="px-3 py-1.5 text-sm font-medium text-surface-600 dark:text-dark-text 
                hover:bg-surface-100 dark:hover:bg-dark-hover rounded-md transition-colors"
            >
              Today
            </button>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => navigateDate(-1)}
                className="p-1.5 text-surface-600 dark:text-dark-text hover:bg-surface-100 
                  dark:hover:bg-dark-hover rounded-md transition-colors"
              >
                <ChevronLeft size={20} />
              </button>
              <span className="text-sm font-medium text-surface-700 dark:text-dark-text min-w-[150px] text-center">
                {formatDateRange()}
              </span>
              <button
                onClick={() => navigateDate(1)}
                className="p-1.5 text-surface-600 dark:text-dark-text hover:bg-surface-100 
                  dark:hover:bg-dark-hover rounded-md transition-colors"
              >
                <ChevronRight size={20} />
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <div className="p-4">
        <div className="text-sm text-surface-500 dark:text-dark-text/70">
          {timelineTasks.length} tasks
        </div>
        
        {displayMode === 'timeline' ? (
          <TimelineGrid 
            viewType={viewType}
            currentDate={currentDate}
            tasks={timelineTasks}
            onTaskClick={handleTaskClick}
            onAddTask={handleAddTask}
          />
        ) : (
          <div className="mt-4 space-y-2">
            {timelineTasks
              .sort((a, b) => {
                const aDate = a.startDate ? new Date(a.startDate) : new Date(a.dueDate);
                const bDate = b.startDate ? new Date(b.startDate) : new Date(b.dueDate);
                return aDate - bDate;
              })
              .map(task => (
                <div 
                  key={task.id}
                  className="p-3 border border-surface-200 dark:border-dark-border rounded-lg
                    hover:bg-surface-50 dark:hover:bg-dark-hover transition-colors cursor-pointer"
                  onClick={() => handleTaskClick(task)}
                >
                  <div className="flex items-center space-x-2">
                    <div 
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: '#94a3b8' }}
                    />
                    <span className="text-sm font-medium text-surface-700 dark:text-dark-text">
                      {task.title}
                    </span>
                    <span className="text-xs text-surface-500 dark:text-dark-text/70">
                      in {task.projectTitle}
                    </span>
                  </div>
                  <div className="mt-1 text-xs text-surface-500 dark:text-dark-text/70 flex items-center space-x-2">
                    {task.startDate && (
                      <span>Start: {new Date(task.startDate).toLocaleDateString()}</span>
                    )}
                    {task.startDate && task.dueDate && <span>•</span>}
                    {task.dueDate && (
                      <span>Due: {new Date(task.dueDate).toLocaleDateString()}</span>
                    )}
                  </div>
                </div>
              ))}
          </div>
        )}
      </div>

      {isTaskDialogOpen && selectedTask && (
        <TaskDialog
          isOpen={isTaskDialogOpen}
          onClose={closeTaskDialog}
          task={selectedTask}
          onUpdateTask={handleTaskUpdate}
          projects={projects}
          isNew={isNewTask}
        />
      )}
    </div>
  );
};

export default CalendarView;
