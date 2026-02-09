import { useEffect, useState } from 'react';

export type ProjectDocument = {
  id: string;
  name: string;
  size: string;
  date: string;
  url?: string;
};

export type Project = {
  id: string;
  name: string;
  status: string;
  deadline: string;
  description?: string;
  progress: number;
  spent: number;
  budget: number;
  documents: ProjectDocument[];
};

const STORAGE_KEY = 'portalpixel_projects';

const loadProjects = (): Project[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as Project[];
      if (Array.isArray(parsed)) return parsed;
    }
  } catch {
    // Ignore storage errors and fall back to defaults.
  }
  return [];
};

export const useProjectsState = () => {
  const [projects, setProjects] = useState<Project[]>(() => loadProjects());

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
    } catch {
      // Ignore storage errors.
    }
  }, [projects]);

  return { projects, setProjects };
};
