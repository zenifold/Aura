import React from 'react';
import { Plus } from 'lucide-react';
import TaskBar from './TaskBar';
import TimelineScroller from './TimelineScroller';

const TimelineGrid = ({ viewType, currentDate, tasks, onTaskClick, onAddTask }) => {
  console.log('TimelineGrid rendering with tasks:', tasks);

  const getTimelineHeaders = () => {
    const headers = [];
    const today = new Date();
    
    switch (viewType) {
      case 'day': {
        for (let hour = 0; hour < 24; hour++) {
          headers.push({
            text: `${hour.toString().padStart(2, '0')}:00`,
            subText: `${hour.toString().padStart(2, '0')}:30`,
            date: new Date(currentDate.setHours(hour, 0, 0)),
            isNow: today.getHours() === hour
          });
        }
        break;
      }
      case 'week': {
        // Start from today and show 3 days before and 3 days after
        const todayIndex = 3; // Position of today in the week view (4th column)
        const startDate = new Date(today);
        startDate.setDate(today.getDate() - todayIndex);
        
        for (let i = 0; i < 7; i++) {
          const date = new Date(startDate);
          date.setDate(startDate.getDate() + i);
          headers.push({
            text: date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }),
            isToday: date.toDateString() === today.toDateString(),
            date: new Date(date)
          });
        }
        break;
      }
      case 'month': {
        const startMonth = new Date(currentDate);
        startMonth.setMonth(startMonth.getMonth() - 2);
        startMonth.setDate(1);
        
        for (let i = 0; i < 6; i++) {
          const monthDate = new Date(startMonth);
          monthDate.setMonth(startMonth.getMonth() + i);
          
          const daysInMonth = new Date(monthDate.getFullYear(), monthDate.getMonth() + 1, 0).getDate();
          const monthDays = [];
          
          for (let day = 1; day <= daysInMonth; day++) {
            const date = new Date(monthDate.getFullYear(), monthDate.getMonth(), day);
            monthDays.push({
              text: date.toLocaleDateString('en-US', { weekday: 'short', day: 'numeric' }),
              isToday: date.toDateString() === today.toDateString(),
              date: new Date(date)
            });
          }
          
          headers.push({
            month: monthDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
            days: monthDays,
            date: new Date(monthDate)
          });
        }
        break;
      }
    }
    
    return headers;
  };

  const calculateTaskPosition = (task, headers) => {
    console.log('Calculating position for task:', task);

    if (!task.startDate && !task.dueDate) {
      console.log('Task has no dates, skipping:', task.id);
      return null;
    }

    const startDate = task.startDate ? new Date(task.startDate) : new Date(task.dueDate);
    const endDate = task.dueDate ? new Date(task.dueDate) : new Date(task.startDate);

    console.log('Start date:', startDate);
    console.log('End date:', endDate);
    
    let startPos = 0;
    let width = 100;

    switch (viewType) {
      case 'day': {
        const startHour = startDate.getHours();
        const endHour = endDate.getHours();
        startPos = (startHour / 24) * 100;
        width = ((endHour - startHour) / 24) * 100;
        break;
      }
      case 'week': {
        const weekStart = headers[0].date;
        const daysDiff = Math.floor((startDate - weekStart) / (1000 * 60 * 60 * 24));
        const duration = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24)) + 1;
        
        startPos = (daysDiff / 7) * 100;
        width = (duration / 7) * 100;
        break;
      }
      case 'month': {
        const firstMonth = headers[0].date;
        const totalDays = 31 * 6; // Approximate month view span
        
        const startDays = Math.floor((startDate - firstMonth) / (1000 * 60 * 60 * 24));
        const duration = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24)) + 1;
        
        startPos = (startDays / totalDays) * 100;
        width = (duration / totalDays) * 100;
        break;
      }
    }

    console.log('Calculated startPos:', startPos);
    console.log('Calculated width:', width);

    return {
      left: `${Math.max(0, Math.min(startPos, 100))}%`,
      width: `${Math.max(5, Math.min(width, 100 - startPos))}%`
    };
  };

  const headers = getTimelineHeaders();

  // Group tasks by project
  const projectGroups = tasks.reduce((groups, task) => {
    if (!task.projectId) {
      console.warn('Task missing projectId:', task);
      return groups;
    }
    if (!groups[task.projectId]) {
      groups[task.projectId] = [];
    }
    groups[task.projectId].push(task);
    return groups;
  }, {});

  console.log('Project groups:', projectGroups);

  const gridContent = (
    <div className={`min-w-full ${viewType === 'month' ? 'min-w-[1600px]' : ''}`}>
      {/* Headers */}
      {viewType === 'month' ? (
        <div className="flex flex-col">
          <div className="flex border-b border-surface-200 dark:border-dark-border">
            <div className="w-48 flex-shrink-0 p-2 border-r border-surface-200 dark:border-dark-border">
              Projects
            </div>
            <div className="flex-1 flex">
              {headers.map((month, monthIndex) => (
                <div key={monthIndex} className="flex-1 min-w-[300px]">
                  <div className="text-center p-2 font-medium border-r border-surface-200 
                    dark:border-dark-border bg-surface-50 dark:bg-dark-hover">
                    {month.month}
                  </div>
                  <div className="flex flex-wrap">
                    {month.days.map((day, dayIndex) => (
                      <div
                        key={dayIndex}
                        className={`w-[14.28%] p-1 text-center text-xs border-r border-b
                          border-surface-200 dark:border-dark-border ${day.isToday 
                            ? 'bg-aura-50 dark:bg-aura-500/10' 
                            : ''}`}
                      >
                        {day.text}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="flex border-b border-surface-200 dark:border-dark-border">
          <div className="w-48 flex-shrink-0 p-2 border-r border-surface-200 dark:border-dark-border">
            Projects
          </div>
          <div className="flex-1 flex">
            {headers.map((header, index) => (
              <div
                key={index}
                className={`flex-1 ${viewType === 'day' ? 'min-w-[100px]' : ''} 
                  border-r border-surface-200 dark:border-dark-border`}
              >
                <div className={`p-2 text-center text-sm ${header.isToday || header.isNow
                  ? 'bg-aura-50 dark:bg-aura-500/10' 
                  : ''}`}
                >
                  {header.text}
                </div>
                {viewType === 'day' && (
                  <div className="text-center text-xs text-surface-500 dark:text-dark-text/70 pb-1">
                    {header.subText}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Project Rows */}
      {Object.entries(projectGroups).map(([projectId, projectTasks]) => {
        const project = projectTasks[0];
        console.log('Rendering project row:', projectId, project);

        return (
          <div key={projectId} className="flex border-b border-surface-200 dark:border-dark-border">
            <div className="w-48 flex-shrink-0 p-2 border-r border-surface-200 dark:border-dark-border">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div 
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: '#94a3b8' }}
                  />
                  <span className="text-sm font-medium text-surface-700 dark:text-dark-text">
                    {project.projectTitle}
                  </span>
                </div>
                <button
                  onClick={() => onAddTask?.(projectId)}
                  className="p-1 hover:bg-surface-100 dark:hover:bg-dark-hover rounded-md 
                    text-surface-600 dark:text-dark-text transition-colors"
                  title="Add task"
                >
                  <Plus size={16} />
                </button>
              </div>
            </div>
            <div className="flex-1 flex relative min-h-[120px] p-2">
              {viewType === 'day' && (
                <div className="absolute inset-0 flex pointer-events-none">
                  {Array.from({ length: 24 }).map((_, i) => (
                    <div key={i} className="flex-1 border-r border-surface-200 dark:border-dark-border" />
                  ))}
                </div>
              )}
              {projectTasks.map((task, taskIndex) => {
                console.log('Processing task in project row:', task);
                const position = calculateTaskPosition(task, headers);
                if (!position) return null;

                const verticalOffset = taskIndex * 32;
                position.top = `${verticalOffset}px`;

                return (
                  <TaskBar
                    key={task.id}
                    task={task}
                    position={position}
                    onTaskClick={() => onTaskClick(task)}
                  />
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );

  return (
    <div className="mt-4">
      <TimelineScroller viewType={viewType}>
        {gridContent}
      </TimelineScroller>
    </div>
  );
};

export default TimelineGrid;
