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
  title: 'My First Project',
  color: colors[0],
  columns: [
    { 
      id: 'todo', 
      title: 'To Do',
      color: {
        light: 'bg-surface-100',
        text: 'text-surface-600',
        dark: 'dark:bg-dark-hover'
      },
      tasks: [] 
    },
    { 
      id: 'in-progress', 
      title: 'In Progress',
      color: {
        light: 'bg-blue-50',
        text: 'text-blue-600',
        dark: 'dark:bg-blue-500/10'
      },
      tasks: [] 
    },
    { 
      id: 'done', 
      title: 'Done',
      color: {
        light: 'bg-green-50',
        text: 'text-green-600',
        dark: 'dark:bg-green-500/10'
      },
      tasks: [] 
    }
  ]
};

const AuraBoard = () => {
  const [projects, setProjects] = useState(() => {
    const savedState = loadState();
    return savedState?.projects || [defaultProject];
  });

  const [currentView, setCurrentView] = useState(() => {
    const savedState = loadState();
    return savedState?.currentView || 'board';
  });

  const [isAddingProject, setIsAddingProject] = useState(false);
  const [newProjectTitle, setNewProjectTitle] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [isMenuCollapsed, setIsMenuCollapsed] = useState(() => {
    const savedState = loadState();
    return savedState?.menuCollapsed || false;
  });
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  const { moveProjectUp, moveProjectDown } = useProjectSort(projects, setProjects);

  useEffect(() => {
    saveState({ projects, currentView, menuCollapsed: isMenuCollapsed });
  }, [projects, currentView, isMenuCollapsed]);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleAddProject = (e) => {
    e.preventDefault();
    if (!newProjectTitle.trim()) return;

    const newProject = {
      id: Date.now().toString(),
      title: newProjectTitle.trim(),
      color: colors[Math.floor(Math.random() * colors.length)],
      columns: [
        { 
          id: 'todo', 
          title: 'To Do',
          color: {
            light: 'bg-surface-100',
            text: 'text-surface-600',
            dark: 'dark:bg-dark-hover'
          },
          tasks: [] 
        },
        { 
          id: 'in-progress', 
          title: 'In Progress',
          color: {
            light: 'bg-blue-50',
            text: 'text-blue-600',
            dark: 'dark:bg-blue-500/10'
          },
          tasks: [] 
        },
        { 
          id: 'done', 
          title: 'Done',
          color: {
            light: 'bg-green-50',
            text: 'text-green-600',
            dark: 'dark:bg-green-500/10'
          },
          tasks: [] 
        }
      ]
    };

    setProjects([...projects, newProject]);
    setNewProjectTitle('');
    setIsAddingProject(false);
  };

  const handleUpdateProject = (updatedProject) => {
    setProjects(projects.map(p => 
      p.id === updatedProject.id ? updatedProject : p
    ));
  };

  const handleDeleteProject = (projectId) => {
    setProjects(projects.filter(p => p.id !== projectId));
  };

  const getAllTasks = () => {
    return projects.flatMap(project => 
      project.columns.flatMap(column => 
        column.tasks.map(task => ({
          ...task,
          id: task.id || `task-${Date.now()}-${Math.random()}`,
          title: task.title || '',
          description: task.description || '',
          projectId: project.id,
          projectTitle: project.title,
          projectColor: project.color,
          mainStatus: column.title,
          statusColor: column.color || {
            light: 'bg-surface-100',
            text: 'text-surface-600',
            dark: 'dark:bg-dark-hover'
          },
          createdAt: task.createdAt || new Date().toISOString(),
          priority: task.priority || null,
          labels: task.labels || [],
          hierarchyType: task.hierarchyType || 'task',
          relationships: task.relationships || [],
          startDate: task.startDate || null,
          dueDate: task.dueDate || null
        }))
      )
    );
  };

  const filteredProjects = projects.filter(project =>
    project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    project.columns.some(column =>
      column.tasks.some(task =>
        task.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        task.labels?.some(label =>
          label.text.toLowerCase().includes(searchQuery.toLowerCase())
        ) ||
        task.tags?.some(tag =>
          tag.toLowerCase().includes(searchQuery.toLowerCase())
        )
      )
    )
  );

  const renderBoardView = () => (
    <div className="space-y-8">
      {filteredProjects.map((project, index) => (
        <ProjectRow
          key={project.id}
          project={project}
          onUpdateProject={handleUpdateProject}
          onDeleteProject={handleDeleteProject}
          onMoveUp={index > 0 ? () => moveProjectUp(index) : null}
          onMoveDown={index < projects.length - 1 ? () => moveProjectDown(index) : null}
        />
      ))}
    </div>
  );

  return (
    <div className="flex h-screen overflow-hidden">
      <SideMenu
        view={currentView}
        onViewChange={setCurrentView}
        isCollapsed={isMenuCollapsed}
        onToggleCollapse={() => setIsMenuCollapsed(!isMenuCollapsed)}
        isMobile={isMobile}
      />
      
      <main 
        className="flex-1 overflow-x-hidden overflow-y-auto"
        style={{ 
          marginLeft: isMobile ? 0 : (isMenuCollapsed ? '72px' : '220px'),
          width: isMobile ? '100%' : `calc(100% - ${isMenuCollapsed ? '72px' : '220px'})`,
        }}
      >
        <div className="p-3 md:p-6">
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

          {currentView === 'board' && renderBoardView()}

          {currentView === 'list' && (
            <ListView 
              projects={projects}
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
      </main>
    </div>
  );
};

export default AuraBoard;
