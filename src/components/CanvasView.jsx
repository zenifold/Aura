import React, { useState, useCallback } from 'react';
import ReactFlow, { 
  Background, 
  Controls, 
  useNodesState, 
  useEdgesState,
  addEdge,
  Panel,
  Position,
  MarkerType
} from 'reactflow';
import TaskDialog from './TaskDialog';
import RelationshipDialog from './RelationshipDialog';
import CanvasTask from './CanvasTask';
import { Plus } from 'lucide-react';
import { useCanvas } from '../hooks/useCanvas';
import 'reactflow/dist/style.css';

// Edge styling based on relationship type
const getEdgeStyle = (type) => {
  switch (type) {
    case 'blocks':
      return { stroke: '#ef4444', strokeWidth: 2 }; // red
    case 'blocked-by':
      return { stroke: '#f97316', strokeWidth: 2 }; // orange
    case 'relates-to':
      return { stroke: '#3b82f6', strokeWidth: 2 }; // blue
    case 'duplicates':
      return { stroke: '#a855f7', strokeWidth: 2 }; // purple
    case 'parent-of':
      return { stroke: '#22c55e', strokeWidth: 2 }; // green
    case 'child-of':
      return { stroke: '#14b8a6', strokeWidth: 2 }; // teal
    default:
      return { stroke: '#94a3b8', strokeWidth: 2 }; // gray
  }
};

// Get the inverse relationship type
const getInverseRelationType = (type) => {
  switch (type) {
    case 'blocks': return 'blocked-by';
    case 'blocked-by': return 'blocks';
    case 'parent-of': return 'child-of';
    case 'child-of': return 'parent-of';
    case 'relates-to': return 'relates-to';
    case 'duplicates': return 'duplicates';
    default: return type;
  }
};

const nodeTypes = {
  task: CanvasTask
};

const CanvasView = ({ projectId, projects, onProjectSelect, onUpdateProject }) => {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [isTaskDialogOpen, setIsTaskDialogOpen] = useState(false);
  const [isRelationshipDialogOpen, setIsRelationshipDialogOpen] = useState(false);
  const [pendingConnection, setPendingConnection] = useState(null);

  // Initialize useCanvas hook
  const { startConnection, completeConnection, cancelConnection } = useCanvas(projectId);

  // Get current project and its tasks
  const currentProject = projects.find(p => p.id === projectId);
  
  // Convert tasks to nodes and relationships to edges
  React.useEffect(() => {
    if (!currentProject) return;

    console.log('Converting tasks to nodes for project:', currentProject);

    const taskNodes = currentProject.columns.flatMap((column, columnIndex) => 
      column.tasks.map((task, taskIndex) => ({
        id: task.id,
        type: 'task',
        position: task.canvasPosition || { 
          x: 100 + (columnIndex * 300), 
          y: 100 + (taskIndex * 150) 
        },
        data: {
          ...task,
          projectId: currentProject.id,
          mainStatus: column.title,
          statusColor: column.color
        },
        draggable: true
      }))
    );

    console.log('Created nodes:', taskNodes);

    // Convert relationships to edges
    const taskEdges = currentProject.columns.flatMap(column =>
      column.tasks.flatMap(task =>
        (task.relationships || []).map(rel => ({
          id: `${task.id}-${rel.type}-${rel.taskId}`,
          source: task.id,
          target: rel.taskId,
          sourceHandle: `${task.id}-${rel.sourceHandle || 'right'}`,
          targetHandle: `${rel.taskId}-${rel.targetHandle || 'left'}`,
          type: 'smoothstep',
          animated: true,
          style: getEdgeStyle(rel.type),
          markerEnd: {
            type: MarkerType.ArrowClosed,
            color: getEdgeStyle(rel.type).stroke
          },
          data: { type: rel.type }
        }))
      )
    );

    console.log('Created edges:', taskEdges);

    setNodes(taskNodes);
    setEdges(taskEdges);
  }, [currentProject, setNodes, setEdges]);

  const onConnect = useCallback((params) => {
    console.log('onConnect called with params:', params);
    console.log('Current project state:', currentProject);

    if (!currentProject) {
      console.warn('No current project found');
      return;
    }

    // Debug: Log all tasks in the project
    const allTasks = currentProject.columns.flatMap(col => col.tasks);
    console.log('All available tasks:', allTasks);
    
    // Find the source and target tasks
    const sourceTask = allTasks.find(task => task.id === params.source);
    const targetTask = allTasks.find(task => task.id === params.target);

    console.log('Found source task:', sourceTask);
    console.log('Found target task:', targetTask);

    if (sourceTask && targetTask) {
      // Extract handle positions from the IDs
      const sourceHandle = params.sourceHandle?.split('-')[1] || 'right';
      const targetHandle = params.targetHandle?.split('-')[1] || 'left';
      
      console.log('Setting pending connection with handles:', { sourceHandle, targetHandle });
      
      // Start the connection in useCanvas
      startConnection(sourceTask.id, sourceHandle);
      
      setPendingConnection({ 
        params: { ...params, sourceHandle, targetHandle }, 
        sourceTask, 
        targetTask 
      });
      
      console.log('Opening relationship dialog');
      setIsRelationshipDialogOpen(true);

      // Prevent default edge creation until relationship type is selected
      return false;
    } else {
      console.warn('Could not find source or target task:', {
        sourceId: params.source,
        targetId: params.target,
        sourceFound: !!sourceTask,
        targetFound: !!targetTask
      });
      cancelConnection();
    }
  }, [currentProject, startConnection, cancelConnection]);

  const handleRelationshipSelect = (type) => {
    console.log('handleRelationshipSelect called with type:', type);
    if (!pendingConnection || !currentProject) {
      console.warn('No pending connection or current project:', { 
        hasPendingConnection: !!pendingConnection, 
        hasCurrentProject: !!currentProject 
      });
      return;
    }

    const { params, sourceTask, targetTask } = pendingConnection;

    // Create the new edge
    const newEdge = {
      id: `${params.source}-${type}-${params.target}`,
      source: params.source,
      target: params.target,
      sourceHandle: `${params.source}-${params.sourceHandle}`,
      targetHandle: `${params.target}-${params.targetHandle}`,
      type: 'smoothstep',
      animated: true,
      style: getEdgeStyle(type),
      markerEnd: {
        type: MarkerType.ArrowClosed,
        color: getEdgeStyle(type).stroke
      },
      data: { type }
    };

    console.log('Creating new edge:', newEdge);

    // Update edges state
    setEdges(eds => [...eds, newEdge]);

    // Complete the connection in useCanvas
    completeConnection(params.target, params.targetHandle);

    // Update task relationships in the project
    const updatedColumns = currentProject.columns.map(column => ({
      ...column,
      tasks: column.tasks.map(task => {
        // Add relationship to source task
        if (task.id === sourceTask.id) {
          const sourceRelationship = {
            type,
            taskId: params.target,
            sourceHandle: params.sourceHandle,
            targetHandle: params.targetHandle
          };
          return {
            ...task,
            relationships: [...(task.relationships || []), sourceRelationship]
          };
        }
        // Add inverse relationship to target task
        if (task.id === targetTask.id) {
          const targetRelationship = {
            type: getInverseRelationType(type),
            taskId: params.source,
            sourceHandle: params.targetHandle,
            targetHandle: params.sourceHandle
          };
          return {
            ...task,
            relationships: [...(task.relationships || []), targetRelationship]
          };
        }
        return task;
      })
    }));

    const updatedProject = {
      ...currentProject,
      columns: updatedColumns
    };

    console.log('Updating project with new relationship:', updatedProject);
    onUpdateProject(updatedProject);
    setPendingConnection(null);
    setIsRelationshipDialogOpen(false);
  };

  const handleTaskCreate = (taskData) => {
    if (!currentProject || !currentProject.columns.length) return;
    
    // Find the column that matches the task's status
    const targetColumn = currentProject.columns.find(col => col.title === taskData.status) || currentProject.columns[0];
    const newTask = {
      ...taskData,
      id: Date.now().toString(),
      canvasPosition: { 
        x: 100 + (currentProject.columns.indexOf(targetColumn) * 300),
        y: 100 + (targetColumn.tasks.length * 150)
      }
    };

    // Create updated project with new task
    const updatedColumns = currentProject.columns.map(column => {
      if (column.title === targetColumn.title) {
        return {
          ...column,
          tasks: [...column.tasks, newTask]
        };
      }
      return column;
    });

    const updatedProject = {
      ...currentProject,
      columns: updatedColumns
    };

    // Update both local state and parent state
    onUpdateProject(updatedProject);
    onProjectSelect(updatedProject.id);
    setIsTaskDialogOpen(false);
  };

  // Update task positions when nodes are dragged
  const onNodeDragStop = useCallback((event, node) => {
    if (!currentProject) return;

    const updatedColumns = currentProject.columns.map(column => ({
      ...column,
      tasks: column.tasks.map(task => 
        task.id === node.id 
          ? { ...task, canvasPosition: node.position }
          : task
      )
    }));

    const updatedProject = {
      ...currentProject,
      columns: updatedColumns
    };

    onUpdateProject(updatedProject);
  }, [currentProject, onUpdateProject]);

  // Get all available tasks for task dialogs
  const allAvailableTasks = currentProject?.columns.flatMap(col => 
    col.tasks.map(task => ({
      ...task,
      mainStatus: col.title,
      statusColor: col.color
    }))
  ) || [];

  return (
    <div className="w-full h-full relative" style={{ height: 'calc(100vh - 64px)' }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodeDragStop={onNodeDragStop}
        nodeTypes={nodeTypes}
        fitView
        className="bg-surface-50 dark:bg-dark-background"
        defaultViewport={{ x: 0, y: 0, zoom: 1 }}
        minZoom={0.1}
        maxZoom={2}
        snapToGrid={true}
        snapGrid={[20, 20]}
        deleteKeyCode={null}
        selectionKeyCode={null}
        multiSelectionKeyCode={null}
        connectOnClick={false}
      >
        <Background gap={20} />
        <Controls />
        
        {/* Project Selection */}
        <Panel position="top-left" className="bg-white dark:bg-dark-card p-2 rounded-lg shadow-lg">
          <select
            value={projectId || ''}
            onChange={(e) => onProjectSelect(e.target.value)}
            className="px-3 py-2 rounded-lg border border-surface-200 dark:border-dark-border 
              bg-white dark:bg-dark-card text-surface-800 dark:text-dark-text 
              focus:outline-none focus:ring-2 focus:ring-aura-200 dark:focus:ring-aura-500/30"
          >
            {projects.map(project => (
              <option key={project.id} value={project.id}>
                {project.title}
              </option>
            ))}
          </select>
        </Panel>

        {/* Add Task Button */}
        <Panel position="top-right" className="bg-white dark:bg-dark-card p-2 rounded-lg shadow-lg">
          <button
            onClick={() => setIsTaskDialogOpen(true)}
            className="px-3 py-2 bg-aura-500 text-white rounded-md hover:bg-aura-600 
              transition-colors flex items-center gap-1"
          >
            <Plus size={16} />
            <span className="text-sm font-medium">New Task</span>
          </button>
        </Panel>
      </ReactFlow>

      {/* Task Creation Dialog */}
      <TaskDialog
        task={{}}
        isOpen={isTaskDialogOpen}
        onClose={() => setIsTaskDialogOpen(false)}
        onUpdate={handleTaskCreate}
        availableTasks={allAvailableTasks}
        availableColumns={currentProject?.columns || []}
      />

      {/* Relationship Dialog */}
      <RelationshipDialog
        isOpen={isRelationshipDialogOpen}
        onClose={() => {
          console.log('Closing relationship dialog');
          setIsRelationshipDialogOpen(false);
          setPendingConnection(null);
          cancelConnection();
        }}
        onSelect={handleRelationshipSelect}
        sourceTask={pendingConnection?.sourceTask}
        targetTask={pendingConnection?.targetTask}
      />
    </div>
  );
};

export default CanvasView;
