import React, { useState } from 'react';
import { Tag, Plus, X, ChevronDown } from 'lucide-react';
import { colors } from './ColorPicker';

const defaultPriorities = [
  { id: 'urgent', label: 'Urgent', color: { light: 'bg-red-50', text: 'text-status-error', ring: 'ring-status-error' } },
  { id: 'high', label: 'High', color: { light: 'bg-amber-50', text: 'text-status-warning', ring: 'ring-status-warning' } },
  { id: 'medium', label: 'Medium', color: { light: 'bg-blue-50', text: 'text-status-info', ring: 'ring-status-info' } },
  { id: 'low', label: 'Low', color: { light: 'bg-green-50', text: 'text-status-success', ring: 'ring-status-success' } }
];

const TaskMetadata = ({ 
  task, 
  onUpdate,
  availableLabels = [],
  onCreateLabel,
  className = "" 
}) => {
  const [showTagInput, setShowTagInput] = useState(false);
  const [newTag, setNewTag] = useState('');
  const [showLabelPicker, setShowLabelPicker] = useState(false);
  const [showPriorityPicker, setShowPriorityPicker] = useState(false);

  const handleAddTag = (e) => {
    e.preventDefault();
    if (newTag.trim()) {
      const updatedTags = [...(task.tags || []), newTag.trim()];
      onUpdate({ ...task, tags: updatedTags });
      setNewTag('');
      setShowTagInput(false);
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    const updatedTags = (task.tags || []).filter(tag => tag !== tagToRemove);
    onUpdate({ ...task, tags: updatedTags });
  };

  const handleToggleLabel = (label) => {
    const currentLabels = task.labels || [];
    const hasLabel = currentLabels.some(l => l.id === label.id);
    
    const updatedLabels = hasLabel
      ? currentLabels.filter(l => l.id !== label.id)
      : [...currentLabels, label];
    
    onUpdate({ ...task, labels: updatedLabels });
  };

  const handleSetPriority = (priority) => {
    onUpdate({ ...task, priority });
    setShowPriorityPicker(false);
  };

  const handleCreateNewLabel = (e) => {
    e.preventDefault();
    const labelText = e.target.elements.labelText.value.trim();
    if (labelText) {
      const newLabel = {
        id: `label-${Date.now()}`,
        text: labelText,
        color: colors[Math.floor(Math.random() * colors.length)]
      };
      onCreateLabel(newLabel);
      e.target.reset();
    }
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Priority Picker */}
      <div className="relative">
        <button
          onClick={() => setShowPriorityPicker(!showPriorityPicker)}
          className={`
            w-full px-3.5 py-2 rounded-lg border border-surface-200 flex items-center justify-between
            ${task.priority ? task.priority.color.light : 'bg-surface-50 hover:bg-surface-100'}
            transition-colors duration-200
          `}
        >
          <span className={task.priority ? task.priority.color.text : 'text-surface-600'}>
            {task.priority ? task.priority.label : 'Set Priority'}
          </span>
          <ChevronDown size={16} className={task.priority ? task.priority.color.text : 'text-surface-400'} />
        </button>
        
        {showPriorityPicker && (
          <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-lg shadow-aura-lg 
            border border-surface-200 overflow-hidden z-10">
            {defaultPriorities.map(priority => (
              <button
                key={priority.id}
                onClick={() => handleSetPriority(priority)}
                className={`
                  w-full px-3.5 py-2.5 text-left flex items-center justify-between
                  ${priority.color.light} ${priority.color.text} font-medium
                  hover:opacity-90 transition-opacity duration-200
                `}
              >
                {priority.label}
                {task.priority?.id === priority.id && <span>✓</span>}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Labels */}
      <div>
        <div className="flex flex-wrap gap-1.5 mb-2">
          {task.labels?.map(label => (
            <span
              key={label.id}
              className={`
                px-2.5 py-1 rounded-full text-sm flex items-center gap-2 font-medium
                ${label.color.light} ${label.color.text} shadow-sm
              `}
            >
              {label.text}
              <button
                onClick={() => handleToggleLabel(label)}
                className="hover:bg-white/20 rounded-full p-0.5 transition-colors"
              >
                <X size={14} />
              </button>
            </span>
          ))}
        </div>
        
        <button
          onClick={() => setShowLabelPicker(!showLabelPicker)}
          className="text-sm text-surface-600 hover:text-aura-600 flex items-center gap-2
            transition-colors duration-200 font-medium"
        >
          <Plus size={16} />
          Add Label
        </button>

        {showLabelPicker && (
          <div className="mt-2 p-4 border border-surface-200 rounded-lg bg-white shadow-aura">
            <div className="max-h-48 overflow-y-auto mb-3 space-y-1">
              {availableLabels.map(label => (
                <button
                  key={label.id}
                  onClick={() => handleToggleLabel(label)}
                  className={`
                    w-full px-3.5 py-2 rounded-lg flex items-center justify-between font-medium
                    ${label.color.light} ${label.color.text}
                    hover:opacity-90 transition-opacity duration-200
                  `}
                >
                  {label.text}
                  {task.labels?.some(l => l.id === label.id) && <span>✓</span>}
                </button>
              ))}
            </div>

            <form onSubmit={handleCreateNewLabel} className="flex gap-2">
              <input
                name="labelText"
                type="text"
                placeholder="Create new label..."
                className="flex-1 px-3 py-2 border border-surface-200 rounded-lg text-sm
                  focus:outline-none focus:ring-2 focus:ring-aura-200 focus:border-aura-500
                  text-surface-700 placeholder-surface-400
                  transition-shadow duration-200"
              />
              <button
                type="submit"
                className="px-3 py-2 bg-aura-500 text-white rounded-lg text-sm hover:bg-aura-600
                  font-medium shadow-sm hover:shadow transition-all duration-200"
              >
                Add
              </button>
            </form>
          </div>
        )}
      </div>

      {/* Tags */}
      <div>
        <div className="flex flex-wrap gap-1.5 mb-2">
          {task.tags?.map(tag => (
            <span
              key={tag}
              className="px-2.5 py-1 bg-surface-100 text-surface-700 rounded-full text-sm 
                flex items-center gap-2 font-medium shadow-sm group"
            >
              <Tag size={14} className="text-surface-500" />
              {tag}
              <button
                onClick={() => handleRemoveTag(tag)}
                className="hover:bg-surface-200 rounded-full p-0.5 transition-colors"
              >
                <X size={14} />
              </button>
            </span>
          ))}
        </div>

        {showTagInput ? (
          <form onSubmit={handleAddTag} className="flex gap-2">
            <input
              type="text"
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              placeholder="Enter tag..."
              className="flex-1 px-3 py-2 border border-surface-200 rounded-lg text-sm
                focus:outline-none focus:ring-2 focus:ring-aura-200 focus:border-aura-500
                text-surface-700 placeholder-surface-400
                transition-shadow duration-200"
              autoFocus
            />
            <button
              type="submit"
              className="px-3 py-2 bg-aura-500 text-white rounded-lg text-sm hover:bg-aura-600
                font-medium shadow-sm hover:shadow transition-all duration-200"
            >
              Add
            </button>
            <button
              type="button"
              onClick={() => {
                setShowTagInput(false);
                setNewTag('');
              }}
              className="px-3 py-2 bg-surface-100 text-surface-600 rounded-lg text-sm 
                hover:bg-surface-200 hover:text-surface-700 font-medium
                transition-colors duration-200"
            >
              Cancel
            </button>
          </form>
        ) : (
          <button
            onClick={() => setShowTagInput(true)}
            className="text-sm text-surface-600 hover:text-aura-600 flex items-center gap-2
              transition-colors duration-200 font-medium"
          >
            <Plus size={16} />
            Add Tag
          </button>
        )}
      </div>
    </div>
  );
};

export default TaskMetadata;
