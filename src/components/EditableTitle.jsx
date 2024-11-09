import React, { useState, useRef, useEffect } from 'react';
import { useTheme } from '../hooks/useTheme';

const EditableTitle = ({ title, onSave }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(title);
  const inputRef = useRef(null);
  const { theme } = useTheme();

  useEffect(() => {
    if (isEditing) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  const handleSave = () => {
    if (editedTitle.trim()) {
      onSave(editedTitle.trim());
      setIsEditing(false);
    }
  };

  return (
    <div className="editable-title">
      {isEditing ? (
        <input
          type="text"
          value={editedTitle}
          onChange={(e) => setEditedTitle(e.target.value)}
          onBlur={handleSave}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              handleSave();
            } else if (e.key === 'Escape') {
              setEditedTitle(title);
              setIsEditing(false);
            }
          }}
          ref={inputRef}
          className="text-2xl font-bold text-surface-800 dark:text-dark-text px-2 py-1 
            border border-surface-200 dark:border-dark-border rounded 
            focus:outline-none focus:ring-2 focus:ring-aura-200 dark:focus:ring-aura-500/30 
            focus:border-aura-500 dark:focus:border-aura-500 bg-white dark:bg-dark-hover 
            transition-all duration-200 w-full"
        />
      ) : (
        <h2 
          onClick={() => setIsEditing(true)}
          className={`text-2xl font-bold text-surface-800 dark:text-dark-text cursor-pointer 
            hover:${theme.colors.text} dark:hover:text-aura-400 transition-colors duration-200`}
        >
          {title}
        </h2>
      )}
    </div>
  );
};

export default EditableTitle;
