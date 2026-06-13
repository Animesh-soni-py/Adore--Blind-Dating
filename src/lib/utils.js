/**
 * Merge class names, filtering out falsy values.
 * Lightweight alternative to clsx/classnames.
 */
export function cn(...classes) {
  return classes.filter(Boolean).join(' ');
}

/**
 * Format a date string to a human-readable format.
 */
export function formatDate(dateString, options = {}) {
  if (!dateString) return '';
  const defaults = { month: 'long', day: 'numeric', year: 'numeric' };
  return new Date(dateString).toLocaleDateString('en-US', { ...defaults, ...options });
}

/**
 * Truncate text to a max length with ellipsis.
 */
export function truncate(str, maxLength = 100) {
  if (!str || str.length <= maxLength) return str;
  return str.slice(0, maxLength).trim() + '…';
}

/**
 * Format a number with commas.
 */
export function formatNumber(num) {
  if (num === null || num === undefined) return '0';
  return num.toLocaleString('en-US');
}

/**
 * Calculate age from date of birth.
 */
export function calculateAge(dob) {
  if (!dob) return null;
  const diff = Date.now() - new Date(dob).getTime();
  return Math.floor(diff / (365.25 * 24 * 60 * 60 * 1000));
}

/**
 * Generate initials from name.
 */
export function getInitials(firstName, lastName) {
  const first = firstName?.charAt(0)?.toUpperCase() || '';
  const last = lastName?.charAt(0)?.toUpperCase() || '';
  return first + last || '?';
}

/**
 * Debounce a function.
 */
export function debounce(fn, delay = 300) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}

/**
 * Format relative time (e.g., "2 hours ago").
 */
export function timeAgo(dateString) {
  if (!dateString) return '';
  const seconds = Math.floor((Date.now() - new Date(dateString).getTime()) / 1000);

  const intervals = [
    { label: 'year', seconds: 31536000 },
    { label: 'month', seconds: 2592000 },
    { label: 'week', seconds: 604800 },
    { label: 'day', seconds: 86400 },
    { label: 'hour', seconds: 3600 },
    { label: 'minute', seconds: 60 },
  ];

  for (const interval of intervals) {
    const count = Math.floor(seconds / interval.seconds);
    if (count >= 1) {
      return `${count} ${interval.label}${count > 1 ? 's' : ''} ago`;
    }
  }
  return 'just now';
}
