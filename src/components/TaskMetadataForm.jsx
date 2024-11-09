import React from 'react';
import { Calendar } from 'lucide-react';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { useAutoResize } from '../hooks/useAutoResize';
import { useTheme } from '../hooks/useTheme';

const TaskMetadataForm = ({
  title,
  setTitle,
  description,
  setDescription,
  startDate,
  setStartDate,
  dueDate,
  setDueDate,
  status,
  setStatus,
  availableColumns = []
}) => {
  const titleInputRef = useAutoResize(title);
  const { theme } = useTheme();

  const DateInput = ({ value, onClick, placeholder }) => (
    <div className="relative w-full" onClick={onClick}>
      <input
        type="text"
        value={value || ''}
        readOnly
        placeholder={placeholder}
        className="w-full pl-10 pr-3 py-2 border border-surface-200 dark:border-dark-border rounded-lg 
          focus:outline-none focus:ring-2 focus:ring-aura-200 dark:focus:ring-aura-500/30 
          focus:border-aura-500 dark:focus:border-aura-500 text-surface-700 dark:text-dark-text 
          placeholder-surface-400 dark:placeholder-dark-text/60 cursor-pointer bg-white dark:bg-dark-hover
          transition-all duration-200"
      />
      <Calendar 
        size={16} 
        className="absolute left-3 top-1/2 transform -translate-y-1/2 text-surface-400 
          dark:text-dark-text/60 pointer-events-none" 
      />
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Title */}
      <div>
        <textarea
          ref={titleInputRef}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Task title"
          className="w-full px-3 py-2 text-lg font-semibold border-0 border-b-2 border-surface-200 
            dark:border-dark-border focus:border-aura-500 dark:focus:border-aura-500 
            focus:outline-none focus:ring-0 resize-none overflow-hidden min-h-[2.5rem] 
            text-surface-800 dark:text-dark-text placeholder-surface-400 dark:placeholder-dark-text/60
            bg-transparent transition-colors duration-200"
          style={{
            minHeight: '2.5rem',
            lineHeight: '1.5',
          }}
          rows={1}
        />
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-medium text-surface-600 dark:text-dark-text/80 mb-1.5">
          Description
        </label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Add a more detailed description..."
          rows={4}
          className="w-full px-3 py-2 border border-surface-200 dark:border-dark-border rounded-lg 
            focus:outline-none focus:ring-2 focus:ring-aura-200 dark:focus:ring-aura-500/30 
            focus:border-aura-500 dark:focus:border-aura-500 resize-vertical min-h-[6rem] 
            text-surface-700 dark:text-dark-text placeholder-surface-400 dark:placeholder-dark-text/60
            bg-white dark:bg-dark-hover transition-all duration-200"
        />
      </div>

      {/* Status */}
      <div>
        <label className="block text-sm font-medium text-surface-600 dark:text-dark-text/80 mb-1.5">
          Status
        </label>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="w-full px-3 py-2 border border-surface-200 dark:border-dark-border rounded-lg 
            focus:outline-none focus:ring-2 focus:ring-aura-200 dark:focus:ring-aura-500/30 
            focus:border-aura-500 dark:focus:border-aura-500 text-surface-700 dark:text-dark-text 
            bg-white dark:bg-dark-hover transition-all duration-200"
        >
          {availableColumns.map(column => (
            <option 
              key={column.id || column.title} 
              value={column.title}
              className="py-1"
            >
              {column.title}
            </option>
          ))}
        </select>
      </div>

      {/* Dates */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Start Date */}
        <div>
          <label className="block text-sm font-medium text-surface-600 dark:text-dark-text/80 mb-1.5">
            Start Date
          </label>
          <DatePicker
            selected={startDate ? new Date(startDate) : null}
            onChange={(date) => setStartDate(date ? date.toISOString() : null)}
            customInput={<DateInput placeholder="Select start date" />}
            dateFormat="MMM d, yyyy"
            isClearable
            placeholderText="Select start date"
            className="w-full"
            calendarClassName="shadow-lg border border-surface-200 dark:border-dark-border 
              bg-white dark:bg-dark-card rounded-lg"
            dayClassName={date => 
              `hover:bg-aura-50 dark:hover:bg-dark-hover hover:text-aura-600 dark:hover:text-aura-400`
            }
            popperClassName="z-[1000]"
            popperModifiers={[
              {
                name: "preventOverflow",
                options: {
                  padding: 16
                }
              }
            ]}
          />
        </div>

        {/* Due Date */}
        <div>
          <label className="block text-sm font-medium text-surface-600 dark:text-dark-text/80 mb-1.5">
            Due Date
          </label>
          <DatePicker
            selected={dueDate ? new Date(dueDate) : null}
            onChange={(date) => setDueDate(date ? date.toISOString() : null)}
            customInput={<DateInput placeholder="Select due date" />}
            dateFormat="MMM d, yyyy"
            isClearable
            minDate={startDate ? new Date(startDate) : null}
            placeholderText="Select due date"
            className="w-full"
            calendarClassName="shadow-lg border border-surface-200 dark:border-dark-border 
              bg-white dark:bg-dark-card rounded-lg"
            dayClassName={date => 
              `hover:bg-aura-50 dark:hover:bg-dark-hover hover:text-aura-600 dark:hover:text-aura-400`
            }
            popperClassName="z-[1000]"
            popperModifiers={[
              {
                name: "preventOverflow",
                options: {
                  padding: 16
                }
              }
            ]}
          />
        </div>
      </div>
    </div>
  );
};

export default TaskMetadataForm;
