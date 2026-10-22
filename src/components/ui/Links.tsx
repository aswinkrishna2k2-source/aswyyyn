import type { AnchorHTMLAttributes } from 'react';
import { FiGithub, FiInstagram, FiLinkedin } from 'react-icons/fi';
import { profile, trackResumeDownload, type SocialKey } from '../../data/profile';

export const SOCIAL_ICONS: Record<SocialKey, typeof FiGithub> = {
  github: FiGithub,
  linkedin: FiLinkedin,
  instagram: FiInstagram,
};

/** Downloads the resume and fires the analytics event the visitor tracker listens for. */
export function ResumeLink({ onClick, ...rest }: AnchorHTMLAttributes<HTMLAnchorElement>) {
  return (
    <a
      href={profile.resume.href}
      download={profile.resume.fileName}
      onClick={(e) => {
        trackResumeDownload();
        onClick?.(e);
      }}
      {...rest}
    />
  );
}
