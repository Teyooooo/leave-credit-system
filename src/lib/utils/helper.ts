import type { AnnouncementInfo } from "$lib/types/data";

export function getInitials(fullName: string): string {
    // Split the full name by spaces
    const names = fullName.trim().split(/\s+/);

    if (names.length === 0) return '';

    // Take the first letter of the first and last word only
    const firstInitial = names[0].charAt(0).toUpperCase();
    const lastInitial = names.length > 1 ? names[names.length - 1].charAt(0).toUpperCase() : '';

    return firstInitial + lastInitial;
}

export function filterArray <T>(search_value: string, arr:T[], where_to_find: keyof T) {

    if (search_value === "") return arr

    if(!where_to_find) return arr

    return arr.filter((item) => {
        const value = item[where_to_find]
        return typeof value === 'string' &&
        value.toLowerCase().includes(search_value.toLowerCase())
    })
}

export function convertTimestamp(timestamp: string, format: 'full' | 'date' | 'monthYear' = 'date') {
    const date = new Date(timestamp);
    
    switch (format) {
        case 'full':
            return date.toLocaleString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });
        
        case 'monthYear':
            return date.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long'
            });
        
        case 'date':
        default:
            return date.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
            });
    }
}

export function segregateAnnouncements(
  announcements: AnnouncementInfo[],
  now: Date = new Date()
) {
  const allAnnouncements: AnnouncementInfo[] = [];
  const activeAnnouncements: AnnouncementInfo[] = [];
  const upcomingAnnouncements: AnnouncementInfo[] = [];
  const expiredAnnouncements: AnnouncementInfo[] = [];

  const nowTime = now.getTime();

  for (const announcement of announcements) {
    const startTime = new Date(announcement.valid_until_start).getTime();
    const endTime = new Date(announcement.valid_until_end).getTime();

    if (nowTime < startTime) {
      // Not started yet
      const updated = {...announcement, type:'upcoming'}
      allAnnouncements.push(updated);
      upcomingAnnouncements.push(updated);
    } else if (nowTime > endTime) {
      // Already ended
      const updated = {...announcement, type:'expired'}
      allAnnouncements.push(updated);
      expiredAnnouncements.push(updated);
    } else {
      // Currently active
      const updated = {...announcement, type:'active'}
      allAnnouncements.push(updated);
      activeAnnouncements.push(updated);
    }
  }

  return {
    allAnnouncements,
    activeAnnouncements,
    upcomingAnnouncements,
    expiredAnnouncements
  };
}

type DateLike = string | number | Date;
export function sortArray<T, K extends keyof T>(
  arr: T[],
  sorted_by: T[K] extends DateLike ? K : never,
  order: 'asc' | 'desc' = 'desc'
) {
  return [...arr].sort((a, b) => {
    const aTime = new Date(a[sorted_by] as DateLike).getTime();
    const bTime = new Date(b[sorted_by] as DateLike).getTime();
    
    if (isNaN(aTime) && isNaN(bTime)) return 0;
    if (isNaN(aTime)) return 1;
    if (isNaN(bTime)) return -1;
    
    const diff = aTime - bTime;
    return order === 'asc' ? diff : -diff;
  });
}
