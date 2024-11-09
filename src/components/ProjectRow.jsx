import React, { useState } from 'react';
import { DndContext, MouseSensor, TouchSensor, useSensor, useSensors, DragOverlay } from '@dnd-kit/core';
import { arrayMove } from '@dnd-kit/sortable';
import { Plus } from 'lucide-react';
import DroppableColumn from './DroppableColumn';
import AddColumnForm from './AddColumnForm';
import SortableProject from './SortableProject';
import { useProjectActions } from '../hooks/useProjectActions';
import { useTheme } from '../hooks/useTheme';

const ProjectRow = ({ 
  project, 
  onUpdateProject, 
  onDeleteProject, 
  onUpdateColumn, 
  onCreateLabel,
  onMoveUp,
  onMoveDown,
  isFirst,
  isLast
}) => {
  const [isAddingColumn, setIsAddingColumn] = useState(false);
  const [activeTask, setActiveTask] = useState(null);
  const [addingTaskForProject, setAddingTaskForProject] = useState(null);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const { theme } = useTheme();

  const {
    handleAddTask,
    handleUpdateTask
  } = useProjectActions(project, onUpdateProject);

  const sensors = useSensors(
    useSensor(MouseSensor, {
      activationConstraint: { distance: 5 },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 250,
        tolerance: 8,
      },
    })
  );

  // Get all tasks from all columns in the project
  const getAllProjectTasks = () => {
    return project.columns.flatMap(column => 
      column.tasks.map(task => ({
        ...task,
        mainStatus: column.title,
        statusColor: column.color
      }))
    );
  };

  const findColumnByTaskId = (taskId) => {
    return project.columns.find(column => 
      column.tasks.some(task => task.id === taskId)
    );
  };

  const handleDragStart = (event) => {
    const { active } = event;
    const activeColumn = findColumnByTaskId(active.id);
    const activeTaskData = activeColumn?.tasks.find(task => task.id === active.id);
    setActiveTask(activeTaskData);
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;
    
    if (!over) {
      setActiveTask(null);
      return;
    }

    const activeColumn = findColumnByTaskId(active.id);
    if (!activeColumn) return;

    const activeTaskData = activeColumn.tasks.find(task => task.id === active.id);
    if (!activeTaskData) return;

    const overColumn = project.columns.find(col => col.id === over.id) || 
                      findColumnByTaskId(over.id);

    if (!overColumn) {
      setActiveTask(null);
      return;
    }

    if (activeColumn.id !== overColumn.id) {
      const updatedTaskData = {
        ...activeTaskData,
        mainStatus: overColumn.title
      };

      const updatedColumns = project.columns.map(col => {
        if (col.id === activeColumn.id) {
          return {
            ...col,
            tasks: col.tasks.filter(task => task.id !== active.id)
          };
        }
        if (col.id === overColumn.id) {
          const overTaskIndex = col.tasks.findIndex(task => task.id === over.id);
          const newTasks = [...col.tasks];
          
          if (overTaskIndex >= 0) {
            newTasks.splice(overTaskIndex, 0, updatedTaskData);
          } else {
            newTasks.push(updatedTaskData);
          }
          
          return {
            ...col,
            tasks: newTasks
          };
        }
        return col;
      });

      onUpdateProject({
        ...project,
        columns: updatedColumns
      });
    } else {
      const oldIndex = activeColumn.tasks.findIndex(task => task.id === active.id);
      const newIndex = activeColumn.tasks.findIndex(task => task.id === over.id);

      if (oldIndex !== newIndex) {
        const updatedColumns = project.columns.map(col => {
          if (col.id === activeColumn.id) {
            return {
              ...col,
              tasks: arrayMove(col.tasks, oldIndex, newIndex)
            };
          }
          return col;
        });

        onUpdateProject({
          ...project,
          columns: updatedColumns
        });
      }
    }

    setActiveTask(null);
  };

  const handleAddTaskClick = (projectId) => {
    setAddingTaskForProject(projectId);
    setNewTaskTitle('');
  };

  const handleCancelAddTask = () => {
    setAddingTaskForProject(null);
    setNewTaskTitle('');
  };

  // Get all project tasks for relationships
  const allProjectTasks = getAllProjectTasks();

  return (
    <div className="mb-4 md:mb-8 last:mb-0">
      <SortableProject
        project={project}
        onUpdateProject={onUpdateProject}
        onDeleteProject={onDeleteProject}
        addingTaskForProject={addingTaskForProject}
        newTaskTitle={newTaskTitle}
        setNewTaskTitle={setNewTaskTitle}
        handleAddTaskClick={handleAddTaskClick}
        handleCancelAddTask={handleCancelAddTask}
        onMoveUp={onMoveUp}
        onMoveDown={onMoveDown}
        isFirst={isFirst}
        isLast={isLast}
      >
        <DndContext 
          sensors={sensors}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          <div className="flex gap-4 md:gap-6 overflow-x-auto pb-6 pt-2 px-4 mt-4 snap-x snap-mandatory touch-pan-x">
            {project.columns.map((column) => (
              <div key={column.id} className="snap-center">
                <DroppableColumn
                  column={column}
                  tasks={column.tasks}
                  onAddTask={handleAddTask}
                  onUpdateTask={handleUpdateTask}
                  onUpdateColumn={onUpdateColumn}
                  projectLabels={project.labels || []}
                  onCreateLabel={onCreateLabel}
                  allProjectTasks={allProjectTasks} // Pass all project tasks for relationships
                />
              </div>
            ))}

            {isAddingColumn ? (
              <div className="flex-shrink-0 w-[280px] md:w-80 bg-white dark:bg-dark-card rounded-lg 
                shadow-aura border border-surface-200 dark:border-dark-border p-3 md:p-4 snap-center
                transition-colors duration-200">
                <AddColumnForm 
                  onAdd={(title, color) => {
                    const updatedColumns = [...project.columns, { 
                      id: `col-${Date.now()}`, 
                      title,
                      color,
                      tasks: [] 
                    }];
                    onUpdateProject({
                      ...project,
                      columns: updatedColumns
                    });
                    setIsAddingColumn(false);
                  }}
                  onCancel={() => setIsAddingColumn(false)}
                />
              </div>
            ) : (
              <div className="snap-center flex-shrink-0">
                <button
                  onClick={() => setIsAddingColumn(true)}
                  className={`
                    w-12 h-12 md:w-10 md:h-10 bg-white dark:bg-dark-card rounded-lg 
                    shadow-aura border border-surface-200 dark:border-dark-border
                    flex items-center justify-center hover:bg-surface-50 dark:hover:bg-dark-hover 
                    transition-colors duration-200 active:bg-surface-100 dark:active:bg-dark-border 
                    touch-manipulation
                  `}
                  title="Add Column"
                >
                  <Plus size={24} className="text-surface-600 dark:text-dark-text" />
                </button>
              </div>
            )}
          </div>

          <DragOverlay>
            {activeTask ? (
              <div className="bg-white dark:bg-dark-card p-3 rounded-lg shadow-lg w-[280px] md:w-80 
                opacity-90 text-surface-700 dark:text-dark-text border border-surface-200 
                dark:border-dark-border transition-colors duration-200">
                {activeTask.title}
              </div>
            ) : null}
          </DragOverlay>
        </DndContext>
      </SortableProject>
    </div>
  );
};

export default ProjectRow;
