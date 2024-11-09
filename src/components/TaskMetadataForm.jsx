import React from 'react';
import { Calendar } from 'lucide-react';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import "./DatePicker.css";
import { useAutoResize } from '../hooks/useAutoResize';
import { useTheme } from '../hooks/useTheme';
import TaskHierarchySelect from './TaskHierarchySelect';

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
  hierarchyType,
  setHierarchyType,
  availableColumns = []
}) => {
  const titleInputRef = useAutoResize(title);
  const { theme } = useTheme();

  const DateInput = React.forwardRef(({ value, onClick, placeholder }, ref) => (
    <div className="relative w-full">
      <input
        ref={ref}
        type="text"
        value={value || ''}
        readOnly
        onClick={onClick}
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
  ));

  DateInput.displayName = 'DateInput';

  const renderDatePicker = (selected, onChange, placeholder, minDate = null) => (
    <div className="relative" style={{ zIndex: 1 }}>
      <DatePicker
        selected={selected ? new Date(selected) : null}
        onChange={(date) => onChange(date ? date.toISOString() : null)}
        customInput={<DateInput placeholder={placeholder} />}
        dateFormat="MMM d, yyyy"
        isClearable
        minDate={minDate}
        placeholderText={placeholder}
        popperClassName="date-picker-popper"
        popperPlacement="bottom-start"
        popperModifiers={[
          {
            name: "offset",
            options: {
              offset: [0, 4]
            }
          },
          {
            name: "preventOverflow",
            options: {
              boundary: 'viewport',
              padding: 8
            }
          }
        ]}
        shouldCloseOnSelect
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

      {/* Task Type */}
      <TaskHierarchySelect
        selectedType={hierarchyType}
        onTypeSelect={setHierarchyType}
      />

      {/* Dates */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Start Date */}
        <div className="relative" style={{ zIndex: 2 }}>
          <label className="block text-sm font-medium text-surface-600 dark:text-dark-text/80 mb-1.5">
            Start Date
          </label>
          {renderDatePicker(startDate, setStartDate, "Select start date")}
        </div>

        {/* Due Date */}
        <div className="relative" style={{ zIndex: 2 }}>
          <label className="block text-sm font-medium text-surface-600 dark:text-dark-text/80 mb-1.5">
            Due Date
          </label>
          {renderDatePicker(dueDate, setDueDate, "Select due date", startDate ? new Date(startDate) : null)}
        </div>
      </div>
    </div>
  );
};

export default TaskMetadataForm;
