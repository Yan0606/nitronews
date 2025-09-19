// Utility functions for avatar handling

/**
 * Generates a default avatar URL using the user's name or email
 * @param name - User's name
 * @param email - User's email (fallback)
 * @param size - Avatar size (default: 200)
 * @returns Default avatar URL
 */
export const getDefaultAvatar = (name?: string, email?: string, size: number = 200): string => {
  const text = name || email || 'User';
  const initials = text
    .split(' ')
    .map(word => word.charAt(0))
    .join('')
    .toUpperCase()
    .slice(0, 2);
  
  // Using a service that generates avatars with initials
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(initials)}&size=${size}&background=3b82f6&color=ffffff&bold=true`;
};

/**
 * Gets the appropriate avatar URL (user's avatar, gravatar, or default)
 * @param avatarUrl - User's custom avatar URL
 * @param gravatar - User's gravatar URL
 * @param name - User's name for default avatar
 * @param email - User's email for default avatar
 * @param size - Avatar size
 * @returns Avatar URL to use
 */
export const getAvatarUrl = (
  avatarUrl?: string | null,
  gravatar?: string | null,
  name?: string,
  email?: string,
  size: number = 200
): string => {
  if (avatarUrl) {
    return avatarUrl;
  }
  
  if (gravatar) {
    return gravatar;
  }
  
  return getDefaultAvatar(name, email, size);
};

/**
 * Gets avatar URL for different contexts with appropriate sizes
 */
export const getAvatarForContext = (
  context: 'header' | 'post' | 'profile' | 'edit',
  avatarUrl?: string | null,
  gravatar?: string | null,
  name?: string,
  email?: string
): string => {
  const sizes = {
    header: 32,
    post: 40,
    profile: 80,
    edit: 48
  };
  
  return getAvatarUrl(avatarUrl, gravatar, name, email, sizes[context]);
};
