import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getAvatarUrl(name?: string, avatarUrl?: string): string {
  if (avatarUrl && avatarUrl.trim() && avatarUrl.startsWith('http')) {
    return avatarUrl;
  }
  const cleanName = (name || 'User').trim();
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(cleanName)}&background=0F5338&color=ffffff&bold=true`;
}

export function handleImageError(e: React.SyntheticEvent<HTMLImageElement, Event>, fallbackName: string = 'User') {
  const target = e.currentTarget;
  target.onerror = null;
  target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(fallbackName)}&background=0F5338&color=ffffff&bold=true`;
}
