import { useState, useEffect } from 'react';

export const useTaskForm = (task, onUpdate) => {
  const [title, setTitle] = useState(task?.title || '');
  const [description, setDescription] = useState(task?.description || '');
  const [startDate, setStartDate] = useState(task?.startDate || null);
  const [dueDate, setDueDate] = useState(task?.dueDate || null);
  const [priority, setPriority] = useState(task?.priority || null);
  const [selectedLabels, setSelectedLabels] = useState(task?.labels || []);
  const [isAddingLabel, setIsAddingLabel] = useState(false);
  const [newLabelText, setNewLabelText] = useState('');
  const [hierarchyType, setHierarchyType] = useState(task?.hierarchyType || 'task');
  const [relationships, setRelationships] = useState(task?.relationships || []);
  const [status, setStatus] = useState(task?.status || task?.mainStatus || 'To Do');

  useEffect(() => {
    if (task) {
      setTitle(task.title || '');
      setDescription(task.description || '');
      setStartDate(task.startDate || null);
      setDueDate(task.dueDate || null);
      setPriority(task.priority || null);
      setSelectedLabels(task.labels || []);
      setHierarchyType(task.hierarchyType || 'task');
      setRelationships(task.relationships || []);
      setStatus(task.status || task.mainStatus || 'To Do');
    }
  }, [task]);

  const handleSubmit = () => {
    const trimmedTitle = (title || '').trim();
    if (trimmedTitle) {
      onUpdate({
        ...task,
        title: trimmedTitle,
        description: (description || '').trim(),
        startDate,
        dueDate,
        priority,
        labels: selectedLabels,
        hierarchyType,
        relationships,
        status
      });
    }
  };

  const handleLabelToggle = (label) => {
    const isSelected = selectedLabels.some(l => l.id === label.id);
    if (isSelected) {
      setSelectedLabels(selectedLabels.filter(l => l.id !== label.id));
    } else {
      setSelectedLabels([...selectedLabels, label]);
    }
  };

  const handleAddLabel = (color) => {
    if (newLabelText.trim()) {
      const newLabel = {
        id: `label-${Date.now()}`,
        text: newLabelText.trim(),
        color
      };
      setSelectedLabels([...selectedLabels, newLabel]);
      setNewLabelText('');
      setIsAddingLabel(false);
      return newLabel;
    }
    return null;
  };

  const handleAddRelationship = (relationship) => {
    // Check if relationship already exists
    const exists = relationships.some(
      rel => rel.taskId === relationship.taskId && rel.type === relationship.type
    );
    
    if (!exists) {
      // Add inverse relationship if needed
      let newRelationships = [...relationships, relationship];
      
      // Handle reciprocal relationships
      if (relationship.type === 'blocks') {
        newRelationships.push({
          type: 'blocked-by',
          taskId: relationship.taskId
        });
      } else if (relationship.type === 'parent-of') {
        newRelationships.push({
          type: 'child-of',
          taskId: relationship.taskId
        });
      } else if (relationship.type === 'child-of') {
        newRelationships.push({
          type: 'parent-of',
          taskId: relationship.taskId
        });
      }
      
      setRelationships(newRelationships);
    }
  };

  const handleRemoveRelationship = (relationship) => {
    let relationshipsToRemove = [relationship];
    
    // Handle reciprocal relationships
    if (relationship.type === 'blocks') {
      relationshipsToRemove.push({
        type: 'blocked-by',
        taskId: relationship.taskId
      });
    } else if (relationship.type === 'parent-of') {
      relationshipsToRemove.push({
        type: 'child-of',
        taskId: relationship.taskId
      });
    } else if (relationship.type === 'child-of') {
      relationshipsToRemove.push({
        type: 'parent-of',
        taskId: relationship.taskId
      });
    }
    
    setRelationships(relationships.filter(rel => 
      !relationshipsToRemove.some(r => 
        r.type === rel.type && r.taskId === rel.taskId
      )
    ));
  };

  return {
    title,
    setTitle,
    description,
    setDescription,
    startDate,
    setStartDate,
    dueDate,
    setDueDate,
    priority,
    setPriority,
    selectedLabels,
    isAddingLabel,
    setIsAddingLabel,
    newLabelText,
    setNewLabelText,
    hierarchyType,
    setHierarchyType,
    relationships,
    status,
    setStatus,
    handleSubmit,
    handleLabelToggle,
    handleAddLabel,
    handleAddRelationship,
    handleRemoveRelationship
  };
};
