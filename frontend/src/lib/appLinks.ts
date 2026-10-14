/**
 * Akademi is split into two apps. This one (Tutoring) hands anything
 * community-related to the Community app, configured via VITE_COMMUNITY_URL.
 */
export const COMMUNITY_APP_URL = ((import.meta.env.VITE_COMMUNITY_URL as string | undefined) ?? '').replace(/\/$/, '');

export const communityUrl = (path = '/') => `${COMMUNITY_APP_URL}${path}`;
