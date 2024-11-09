import { useState } from 'react';

export const useProjectSort = (initialProjects, onUpdateProjects) => {
  const moveProject = (projectId, direction) => {
    const currentIndex = initialProjects.findIndex(p => p.id === projectId);
    if (currentIndex === -1) return;

    const newIndex = direction === 'up' 
      ? Math.max(0, currentIndex - 1)
      : Math.min(initialProjects.length - 1, currentIndex + 1);

    if (currentIndex === newIndex) return;

    const updatedProjects = [...initialProjects];
    const [movedProject] = updatedProjects.splice(currentIndex, 1);
    updatedProjects.splice(newIndex, 0, movedProject);

    // Update positions
    const projectsWithNewPositions = updatedProjects.map((project, index) => ({
      ...project,
      position: index
    }));

    onUpdateProjects(projectsWithNewPositions);
  };

  const moveProjectUp = (projectId) => moveProject(projectId, 'up');
  const moveProjectDown = (projectId) => moveProject(projectId, 'down');

  const sortedProjects = [...initialProjects].sort((a, b) => 
    (a.position ?? 0) - (b.position ?? 0)
  );

  return {
    moveProjectUp,
    moveProjectDown,
    sortedProjects
  };
};
