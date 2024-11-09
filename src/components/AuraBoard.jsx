import React, { useState, useEffect } from 'react';
import { Plus, Search } from 'lucide-react';
import ProjectRow from './ProjectRow';
import SideMenu from './SideMenu';
import ListView from './ListView';
import { loadState, saveState } from '../utils/storage';
import { colors } from './ColorPicker';
import { useProjectSort } from '../hooks/useProjectSort';

const defaultProject = {
  id: 'default',
  title: 'Main Project',
  position: 0,
  color: {
    name: 'aura',
    bg: 'bg-aura-500',
    text: 'text-aura-500',
    light: 'bg-aura-100',
    lightText: 'text-aura-800'
  },
  labels: [
    {
      id: 'label-1',
      text: 'Bug',
      color: { name: 'red', bg: 'bg-status-error', text: 'text-status-error', light: 'bg-red-50', lightText: 'text-red-800' }
    },
    {
      id: 'label-2',
      text: 'Feature',
      color: { name: 'green', bg: 'bg-status-success', text: 'text-status-success', light: 'bg-green-50', lightText: 'text-green-800' }
    },
    {
      id: 'label-3',
      text: 'Enhancement',
      color: { name: 'blue', bg: 'bg-status-info', text: 'text-status-info', light: 'bg-blue-50', lightText: 'text-blue-800' }
    }
  ],
  columns: [
    { 
      id: 'todo', 
      title: 'To Do', 
      tasks: [],
      color: {
        name: 'info',
        bg: 'bg-status-info',
        text: 'text-status-info',
        light: 'bg-blue-100',
        lightText: 'text-blue-800'
      }
    },
    { 
      id: 'inProgress', 
      title: 'In Progress', 
      tasks: [],
      color: {
        name: 'warning',
        bg: 'bg-status-warning',
        text: 'text-status-warning',
        light: 'bg-amber-100',
        lightText: 'text-amber-800'
      }
    },
    { 
      id: 'done', 
      title: 'Done', 
      tasks: [],
      color: {
        name: 'success',
        bg: 'bg-status-success',
        text: 'text-status-success',
        light: 'bg-green-100',
        lightText: 'text-green-800'
      }
    },
  ]
};

const AuraBoard = () => {
  const [projects, setProjects] = useState(null);
  const [isAddingProject, setIsAddingProject] = useState(false);
  const [newProjectTitle, setNewProjectTitle] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentView, setCurrentView] = useState('board');
  const [isMenuCollapsed, setIsMenuCollapsed] = useState(window.innerWidth < 768);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  const {
    moveProjectUp,
    moveProjectDown,
    sortedProjects
  } = useProjectSort(projects || [], setProjects);

  useEffect(() => {
    const initializeState = async () => {
      try {
        const savedState = await loadState();
        if (savedState?.projects) {
          console.log('Loaded saved state:', savedState.projects);
          setProjects(savedState.projects);
        } else {
          console.log('No saved state found, using default');
          setProjects([defaultProject]);
        }
      } catch (error) {
        console.error('Error loading state:', error);
        setProjects([defaultProject]);
      }
    };

    initializeState();
  }, []);

  useEffect(() => {
    const persistState = async () => {
      if (projects) {
        try {
          await saveState({ projects });
          console.log('State saved successfully');
        } catch (error) {
          console.error('Error saving state:', error);
        }
      }
    };

    persistState();
  }, [projects]);

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (mobile && !isMobile) {
        setIsMenuCollapsed(true);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isMobile]);

  const getAllProjectTasks = (project) => {
    return project.columns.reduce((acc, column) => [...acc, ...column.tasks], []);
  };

  const getAllTasks = () => {
    return projects?.reduce((acc, project) => [...acc, ...getAllProjectTasks(project)], []) || [];
  };

  const handleAddProject = (e) => {
    e.preventDefault();
    if (newProjectTitle.trim()) {
      const newProject = {
        id: `project-${Date.now()}`,
        title: newProjectTitle.trim(),
        position: projects ? projects.length : 0,
        color: {
          name: 'aura',
          bg: 'bg-aura-500',
          text: 'text-aura-500',
          light: 'bg-aura-100',
          lightText: 'text-aura-800'
        },
        labels: [],
        columns: [
          { 
            id: `todo-${Date.now()}`, 
            title: 'To Do', 
            tasks: [],
            color: {
              name: 'info',
              bg: 'bg-status-info',
              text: 'text-status-info',
              light: 'bg-blue-100',
              lightText: 'text-blue-800'
            }
          },
          { 
            id: `progress-${Date.now()}`, 
            title: 'In Progress', 
            tasks: [],
            color: {
              name: 'warning',
              bg: 'bg-status-warning',
              text: 'text-status-warning',
              light: 'bg-amber-100',
              lightText: 'text-amber-800'
            }
          },
          { 
            id: `done-${Date.now()}`, 
            title: 'Done', 
            tasks: [],
            color: {
              name: 'success',
              bg: 'bg-status-success',
              text: 'text-status-success',
              light: 'bg-green-100',
              lightText: 'text-green-800'
            }
          },
        ]
      };
      setProjects(projects ? [...projects, newProject] : [newProject]);
      setNewProjectTitle('');
      setIsAddingProject(false);
    }
  };

  const handleCreateLabel = (projectId, newLabel) => {
    if (!projects) return;
    setProjects(projects.map(project => {
      if (project.id === projectId) {
        return {
          ...project,
          labels: [...(project.labels || []), newLabel]
        };
      }
      return project;
    }));
  };

  const handleUpdateProject = (updatedProject) => {
    if (!projects) return;
    setProjects(projects.map(project =>
      project.id === updatedProject.id ? updatedProject : project
    ));
  };

  const handleDeleteProject = (projectId) => {
    if (!projects || projects.length <= 1) return;
    const updatedProjects = projects
      .filter(project => project.id !== projectId)
      .map((project, index) => ({
        ...project,
        position: index
      }));
    setProjects(updatedProjects);
  };

  const handleUpdateColumn = (projectId, updatedColumn) => {
    if (!projects) return;
    setProjects(projects.map(project => 
      project.id === projectId
        ? {
            ...project,
            columns: project.columns.map(col =>
              col.id === updatedColumn.id ? updatedColumn : col
            )
          }
        : project
    ));
  };

  if (projects === null) {
    return (
      <div className="flex items-center justify-center h-screen dark:bg-dark-bg transition-colors duration-200">
        <div className="text-lg text-surface-600 dark:text-dark-text">Loading...</div>
      </div>
    );
  }

  const filteredProjects = searchQuery && sortedProjects
    ? sortedProjects.filter(project => {
        if (project.title.toLowerCase().includes(searchQuery.toLowerCase())) {
          return true;
        }
        return project.columns.some(column =>
          column.tasks.some(task =>
            task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            task.description?.toLowerCase().includes(searchQuery.toLowerCase())
          )
        );
      })
    : sortedProjects || [];

  const renderBoardView = () => (
    <div className="space-y-4 md:space-y-8">
      {filteredProjects.map((project, index) => {
        const projectWithColumnInfo = {
          ...project,
          columns: project.columns.map(column => ({
            ...column,
            projectColumns: project.columns
          }))
        };

        return (
          <ProjectRow
            key={project.id}
            project={projectWithColumnInfo}
            onUpdateProject={handleUpdateProject}
            onDeleteProject={handleDeleteProject}
            onUpdateColumn={(updatedColumn) => handleUpdateColumn(project.id, updatedColumn)}
            onCreateLabel={(newLabel) => handleCreateLabel(project.id, newLabel)}
            onMoveUp={moveProjectUp}
            onMoveDown={moveProjectDown}
            isFirst={index === 0}
            isLast={index === filteredProjects.length - 1}
            allTasks={getAllTasks()}
          />
        );
      })}
    </div>
  );

  return (
    <div className="flex flex-col md:flex-row h-screen overflow-hidden">
      <SideMenu
        view={currentView}
        onViewChange={setCurrentView}
        isCollapsed={isMenuCollapsed}
        onToggleCollapse={() => setIsMenuCollapsed(!isMenuCollapsed)}
        isMobile={isMobile}
      />
      
      <div className="flex-1 overflow-x-hidden overflow-y-auto">
        <div className="p-3 md:p-6">
          {/* Header Section */}
          <div className="mb-4 md:mb-8">
            <div className="flex justify-between items-center mb-4">
              <div className="text-xl md:text-2xl font-bold text-surface-800 dark:text-dark-text">
                {currentView === 'board' && 'Board View'}
                {currentView === 'list' && 'List View'}
                {currentView === 'calendar' && 'Calendar View'}
                {currentView === 'starred' && 'Starred Items'}
                {currentView === 'recent' && 'Recent Items'}
                {currentView === 'tags' && 'Tags View'}
              </div>
              <button
                onClick={() => setIsAddingProject(true)}
                className="p-2 hover:bg-surface-100 dark:hover:bg-dark-hover active:bg-surface-200 
                  rounded-lg transition-colors touch-manipulation text-surface-600 dark:text-dark-text 
                  hover:text-aura-600 dark:hover:text-aura-400"
                title="Add new project"
              >
                <Plus size={24} />
              </button>
            </div>

            {/* Search Bar */}
            <div className="relative">
              <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 
                text-surface-400 dark:text-dark-text/60" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search projects and tasks..."
                className="w-full pl-10 pr-4 py-2.5 text-sm md:text-base border border-surface-200 
                  dark:border-dark-border rounded-lg focus:outline-none focus:ring-2 
                  focus:ring-aura-200 dark:focus:ring-aura-500/30 focus:border-aura-500 
                  dark:focus:border-aura-500 text-surface-700 dark:text-dark-text 
                  placeholder-surface-400 dark:placeholder-dark-text/60 bg-white dark:bg-dark-card
                  transition-all duration-200"
              />
            </div>
          </div>

          {/* New Project Form */}
          {isAddingProject && (
            <div className="mb-4 md:mb-8 bg-white dark:bg-dark-card p-4 md:p-6 rounded-xl 
              shadow-aura border border-surface-200 dark:border-dark-border transition-colors duration-200">
              <form onSubmit={handleAddProject}>
                <h3 className="text-base md:text-lg font-semibold mb-4 text-surface-800 dark:text-dark-text">
                  Create New Project
                </h3>
                <div className="flex flex-col md:flex-row gap-2">
                  <input
                    type="text"
                    value={newProjectTitle}
                    onChange={(e) => setNewProjectTitle(e.target.value)}
                    placeholder="Enter project title..."
                    className="flex-1 px-3 py-2.5 text-sm md:text-base border border-surface-200 
                      dark:border-dark-border rounded-lg focus:outline-none focus:ring-2 
                      focus:ring-aura-200 dark:focus:ring-aura-500/30 focus:border-aura-500 
                      dark:focus:border-aura-500 text-surface-700 dark:text-dark-text 
                      placeholder-surface-400 dark:placeholder-dark-text/60 bg-white dark:bg-dark-card
                      transition-all duration-200"
                    autoFocus
                  />
                  <div className="flex gap-2">
                    <button
                      type="submit"
                      className="flex-1 md:flex-none px-4 py-2.5 bg-aura-500 text-white rounded-lg 
                        hover:bg-aura-600 text-sm md:text-base font-medium shadow-sm hover:shadow 
                        transition-all duration-200 active:bg-aura-700 touch-manipulation"
                    >
                      Add Project
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setIsAddingProject(false);
                        setNewProjectTitle('');
                      }}
                      className="flex-1 md:flex-none px-4 py-2.5 bg-surface-100 dark:bg-dark-hover 
                        text-surface-600 dark:text-dark-text rounded-lg hover:bg-surface-200 
                        dark:hover:bg-dark-border hover:text-surface-700 dark:hover:text-white 
                        text-sm md:text-base font-medium transition-colors duration-200 
                        active:bg-surface-300 dark:active:bg-dark-border/70 touch-manipulation"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </form>
            </div>
          )}

          {/* Views */}
          {currentView === 'board' && renderBoardView()}

          {currentView === 'list' && (
            <ListView 
              projects={filteredProjects}
              onUpdateProject={handleUpdateProject}
              onDeleteProject={handleDeleteProject}
              onMoveUp={moveProjectUp}
              onMoveDown={moveProjectDown}
              allTasks={getAllTasks()}
            />
          )}

          {currentView === 'calendar' && (
            <div className="bg-white dark:bg-dark-card rounded-xl shadow-aura border 
              border-surface-200 dark:border-dark-border p-4 md:p-6 transition-colors duration-200">
              <p className="text-sm md:text-base text-surface-500 dark:text-dark-text/80">
                Calendar view coming soon...
              </p>
            </div>
          )}

          {currentView === 'starred' && (
            <div className="bg-white dark:bg-dark-card rounded-xl shadow-aura border 
              border-surface-200 dark:border-dark-border p-4 md:p-6 transition-colors duration-200">
              <p className="text-sm md:text-base text-surface-500 dark:text-dark-text/80">
                Starred items view coming soon...
              </p>
            </div>
          )}

          {currentView === 'recent' && (
            <div className="bg-white dark:bg-dark-card rounded-xl shadow-aura border 
              border-surface-200 dark:border-dark-border p-4 md:p-6 transition-colors duration-200">
              <p className="text-sm md:text-base text-surface-500 dark:text-dark-text/80">
                Recent items view coming soon...
              </p>
            </div>
          )}

          {currentView === 'tags' && (
            <div className="bg-white dark:bg-dark-card rounded-xl shadow-aura border 
              border-surface-200 dark:border-dark-border p-4 md:p-6 transition-colors duration-200">
              <p className="text-sm md:text-base text-surface-500 dark:text-dark-text/80">
                Tags view coming soon...
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuraBoard;
