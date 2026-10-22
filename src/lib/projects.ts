import type { IconType } from 'react-icons';
import { FiExternalLink, FiGithub } from 'react-icons/fi';
import { SiAppstore, SiGoogleplay } from 'react-icons/si';
import type { Project } from '../data/projects';
import { getProjectGallery } from '../utils/projectGallery';

export function getCover(project: Project): string | undefined {
  return getProjectGallery(project.slug)[0] ?? project.logo;
}

export interface ProjectLink {
  href: string;
  label: string;
  icon: IconType;
}

export function getProjectLinks(project: Project): ProjectLink[] {
  const links: ProjectLink[] = [];
  if (project.liveUrl && project.liveUrl !== '#') links.push({ href: project.liveUrl, label: 'Visit live site', icon: FiExternalLink });
  if (project.appStoreUrl) links.push({ href: project.appStoreUrl, label: 'App Store', icon: SiAppstore });
  if (project.playStoreUrl) links.push({ href: project.playStoreUrl, label: 'Play Store', icon: SiGoogleplay });
  if (project.githubUrl && project.githubUrl !== '#') links.push({ href: project.githubUrl, label: 'GitHub', icon: FiGithub });
  return links;
}
