import React, { useState, useEffect } from 'react';
import { Plus, Check, X, List, Search, Filter, Palette } from 'lucide-react';
import { loadState, saveState } from '../utils/storage';

const Note = ({ note, onUpdate, onDelete }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(note.content);
  const [editedTitle, setEditedTitle] = useState(note.title);
  const [newItem, setNewItem] = useState('');

  const handleSave = () => {
    onUpdate({
      ...note,
      title: editedTitle,
      content: editedContent,
      updatedAt: new Date().toISOString()
    });
    setIsEditing(false);
  };

  const toggleChecklist = (index) => {
    if (note.type === 'checklist') {
      const updatedItems = [...note.items];
      updatedItems[index].checked = !updatedItems[index].checked;
      onUpdate({
        ...note,
        items: updatedItems,
        updatedAt: new Date().toISOString()
      });
    }
  };

  const addChecklistItem = (e) => {
    e.preventDefault();
    if (newItem.trim()) {
      const updatedItems = [...(note.items || []), { text: newItem, checked: false }];
      onUpdate({
        ...note,
        items: updatedItems,
        updatedAt: new Date().toISOString()
      });
      setNewItem('');
    }
  };

  const removeChecklistItem = (index) => {
    const updatedItems = note.items.filter((_, i) => i !== index);
    onUpdate({
      ...note,
      items: updatedItems,
      updatedAt: new Date().toISOString()
    });
  };

  const updateNoteColor = (color) => {
    onUpdate({
      ...note,
      color,
      updatedAt: new Date().toISOString()
    });
  };

  return (
    <div className={`${note.color || 'bg-white'} dark:bg-dark-card rounded-lg shadow-sm border 
      border-surface-200 dark:border-dark-border p-4 break-words hover:shadow-md transition-shadow duration-200`}>
      {isEditing ? (
        <div className="space-y-2">
          <input
            type="text"
            value={editedTitle}
            onChange={(e) => setEditedTitle(e.target.value)}
            placeholder="Title"
            className="w-full px-2 py-1 text-base font-medium bg-transparent border-none 
              focus:outline-none text-surface-800 dark:text-dark-text placeholder-surface-400"
          />
          {note.type === 'text' ? (
            <textarea
              value={editedContent}
              onChange={(e) => setEditedContent(e.target.value)}
              placeholder="Take a note..."
              className="w-full px-2 py-1 text-sm bg-transparent border-none focus:outline-none 
                text-surface-600 dark:text-dark-text/80 placeholder-surface-400 resize-none"
              rows={4}
            />
          ) : (
            <div className="space-y-2">
              {note.items?.map((item, index) => (
                <div key={index} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={item.checked}
                    onChange={() => toggleChecklist(index)}
                    className="rounded border-surface-300 text-aura-500 focus:ring-aura-500/30"
                  />
                  <input
                    type="text"
                    value={item.text}
                    onChange={(e) => {
                      const updatedItems = [...note.items];
                      updatedItems[index].text = e.target.value;
                      onUpdate({ ...note, items: updatedItems });
                    }}
                    className="flex-1 bg-transparent border-none focus:outline-none"
                  />
                  <button
                    onClick={() => removeChecklistItem(index)}
                    className="p-1 text-surface-400 hover:text-surface-600"
                  >
                    <X size={14} />
                  </button>
                </div>
              ))}
              <form onSubmit={addChecklistItem} className="flex items-center gap-2">
                <input
                  type="text"
                  value={newItem}
                  onChange={(e) => setNewItem(e.target.value)}
                  placeholder="Add item..."
                  className="flex-1 bg-transparent border-none focus:outline-none"
                />
                <button
                  type="submit"
                  className="p-1 text-surface-400 hover:text-surface-600"
                >
                  <Plus size={14} />
                </button>
              </form>
            </div>
          )}
          <div className="flex justify-between items-center">
            <div className="flex gap-1">
              {['bg-yellow-100', 'bg-green-100', 'bg-blue-100', 'bg-pink-100', 'bg-white'].map((color) => (
                <button
                  key={color}
                  onClick={() => updateNoteColor(color)}
                  className={`w-6 h-6 rounded-full ${color} border border-surface-200`}
                />
              ))}
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setIsEditing(false)}
                className="p-1.5 rounded-full hover:bg-surface-100 dark:hover:bg-dark-hover 
                  text-surface-500 dark:text-dark-text/80"
              >
                <X size={18} />
              </button>
              <button
                onClick={handleSave}
                className="p-1.5 rounded-full hover:bg-surface-100 dark:hover:bg-dark-hover 
                  text-surface-500 dark:text-dark-text/80"
              >
                <Check size={18} />
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div onClick={() => setIsEditing(true)} className="cursor-pointer">
          {note.title && (
            <h3 className="text-base font-medium text-surface-800 dark:text-dark-text mb-1">
              {note.title}
            </h3>
          )}
          {note.type === 'text' ? (
            <p className="text-sm text-surface-600 dark:text-dark-text/80 whitespace-pre-wrap">
              {note.content}
            </p>
          ) : (
            <div className="space-y-1">
              {note.items?.map((item, index) => (
                <div
                  key={index}
                  className="flex items-start gap-2 text-sm text-surface-600 dark:text-dark-text/80"
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleChecklist(index);
                  }}
                >
                  <input
                    type="checkbox"
                    checked={item.checked}
                    onChange={() => toggleChecklist(index)}
                    className="mt-1 rounded border-surface-300 text-aura-500 focus:ring-aura-500/30"
                  />
                  <span className={item.checked ? 'line-through text-surface-400' : ''}>
                    {item.text}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

const NotesView = () => {
  const [notes, setNotes] = useState([]);
  const [isAdding, setIsAdding] = useState(false);
  const [newNote, setNewNote] = useState({ title: '', content: '', type: 'text' });
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('updatedAt');
  const [sortOrder, setSortOrder] = useState('desc');

  // Load notes from storage on mount
  useEffect(() => {
    const loadNotes = async () => {
      const state = await loadState();
      if (state?.notes) {
        setNotes(state.notes);
      }
    };
    loadNotes();
  }, []);

  // Save notes whenever they change
  useEffect(() => {
    const saveNotes = async () => {
      const state = await loadState() || {};
      await saveState({ ...state, notes });
    };
    saveNotes();
  }, [notes]);

  const handleAddNote = () => {
    if (newNote.content.trim() || newNote.title.trim()) {
      const now = new Date().toISOString();
      setNotes([
        {
          id: Date.now(),
          title: newNote.title,
          content: newNote.content,
          type: newNote.type,
          items: newNote.type === 'checklist' ? [] : undefined,
          color: 'bg-white',
          createdAt: now,
          updatedAt: now
        },
        ...notes
      ]);
      setNewNote({ title: '', content: '', type: 'text' });
      setIsAdding(false);
    }
  };

  const handleUpdateNote = (updatedNote) => {
    setNotes(notes.map(note => 
      note.id === updatedNote.id ? updatedNote : note
    ));
  };

  const handleDeleteNote = (noteId) => {
    setNotes(notes.filter(note => note.id !== noteId));
  };

  const toggleNoteType = () => {
    setNewNote(prev => ({
      ...prev,
      type: prev.type === 'text' ? 'checklist' : 'text'
    }));
  };

  const filteredAndSortedNotes = notes
    .filter(note => {
      const searchLower = searchTerm.toLowerCase();
      return (
        note.title?.toLowerCase().includes(searchLower) ||
        note.content?.toLowerCase().includes(searchLower) ||
        note.items?.some(item => item.text.toLowerCase().includes(searchLower))
      );
    })
    .sort((a, b) => {
      const order = sortOrder === 'asc' ? 1 : -1;
      if (sortBy === 'title') {
        return order * (a.title || '').localeCompare(b.title || '');
      }
      return order * (new Date(a[sortBy]) - new Date(b[sortBy]));
    });

  return (
    <div className="max-w-7xl mx-auto p-4">
      <div className="mb-6 space-y-4">
        {isAdding ? (
          <div className="bg-white dark:bg-dark-card rounded-lg shadow-md border border-surface-200 
            dark:border-dark-border p-4">
            <input
              type="text"
              value={newNote.title}
              onChange={(e) => setNewNote({ ...newNote, title: e.target.value })}
              placeholder="Title"
              className="w-full px-2 py-1 text-base font-medium bg-transparent border-none 
                focus:outline-none text-surface-800 dark:text-dark-text placeholder-surface-400"
            />
            <textarea
              value={newNote.content}
              onChange={(e) => setNewNote({ ...newNote, content: e.target.value })}
              placeholder="Take a note..."
              className="w-full px-2 py-1 text-sm bg-transparent border-none focus:outline-none 
                text-surface-600 dark:text-dark-text/80 placeholder-surface-400 resize-none"
              rows={4}
              autoFocus
            />
            <div className="flex justify-between items-center mt-2">
              <button
                onClick={toggleNoteType}
                className="p-1.5 rounded-full hover:bg-surface-100 dark:hover:bg-dark-hover 
                  text-surface-500 dark:text-dark-text/80"
                title={newNote.type === 'text' ? 'Switch to checklist' : 'Switch to text note'}
              >
                <List size={18} />
              </button>
              <div className="flex gap-2">
                <button
                  onClick={() => setIsAdding(false)}
                  className="p-1.5 rounded-full hover:bg-surface-100 dark:hover:bg-dark-hover 
                    text-surface-500 dark:text-dark-text/80"
                >
                  <X size={18} />
                </button>
                <button
                  onClick={handleAddNote}
                  className="p-1.5 rounded-full hover:bg-surface-100 dark:hover:bg-dark-hover 
                    text-surface-500 dark:text-dark-text/80"
                >
                  <Check size={18} />
                </button>
              </div>
            </div>
          </div>
        ) : (
          <button
            onClick={() => setIsAdding(true)}
            className="w-full bg-white dark:bg-dark-card rounded-lg shadow-sm border 
              border-surface-200 dark:border-dark-border p-4 text-left text-surface-500 
              dark:text-dark-text/80 hover:shadow-md transition-shadow duration-200"
          >
            Take a note...
          </button>
        )}

        <div className="flex gap-4 items-center">
          <div className="flex-1 relative">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search notes..."
              className="w-full pl-10 pr-4 py-2 bg-white dark:bg-dark-card rounded-lg 
                border border-surface-200 dark:border-dark-border focus:outline-none 
                focus:ring-2 focus:ring-aura-500/30"
            />
            <Search className="absolute left-3 top-2.5 text-surface-400" size={18} />
          </div>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-4 py-2 bg-white dark:bg-dark-card rounded-lg border 
              border-surface-200 dark:border-dark-border focus:outline-none 
              focus:ring-2 focus:ring-aura-500/30"
          >
            <option value="updatedAt">Last Updated</option>
            <option value="createdAt">Created Date</option>
            <option value="title">Title</option>
          </select>
          <button
            onClick={() => setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc')}
            className="p-2 bg-white dark:bg-dark-card rounded-lg border 
              border-surface-200 dark:border-dark-border hover:bg-surface-50"
          >
            {sortOrder === 'asc' ? '↑' : '↓'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filteredAndSortedNotes.map(note => (
          <Note
            key={note.id}
            note={note}
            onUpdate={handleUpdateNote}
            onDelete={handleDeleteNote}
          />
        ))}
      </div>
    </div>
  );
};

export default NotesView;
