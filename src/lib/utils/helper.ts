import type { AnnouncementInfo } from "$lib/types/data";
import { CalendarDate, fromDate, getLocalTimeZone, toCalendarDate } from "@internationalized/date";

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

export function convertTimestamp(timestamp: string, format: 'full' | 'date' | 'monthYear' | 'monthYearShort' = 'date') {
    const date = new Date(timestamp);
    
    switch (format) {
        case 'full':
            return date.toLocaleString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });
        
        case 'monthYear':
            return date.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long'
            });

        case 'monthYearShort':
            return date.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short'
            });
        
        case 'date':
        default:
            return date.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
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

  // Get today at midnight as timestamp
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();

  for (const announcement of announcements) {

    // Get dates at midnight without mutating anything
    const startDate = new Date(announcement.valid_until_start);
    const start = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate()).getTime();
    
    const endDate = new Date(announcement.valid_until_end);
    const end = new Date(endDate.getFullYear(), endDate.getMonth(), endDate.getDate()).getTime();

    if (today < start) {
      // Not started yet
      const updated = {...announcement, type:'upcoming'}
      allAnnouncements.push(updated);
      upcomingAnnouncements.push(updated);
    } else if (today > end) {
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

export function getTotalDays(start: CalendarDate, end: CalendarDate) {
  console.log({start, end})

	const diffInMs = end.toDate(getLocalTimeZone()).getTime() - 
	                 start.toDate(getLocalTimeZone()).getTime();
	return Math.floor(diffInMs / (1000 * 60 * 60 * 24)) + 1; // +1 for inclusive
}

export function convertCalendarDate(date: string){
  return toCalendarDate(fromDate(new Date(date), getLocalTimeZone()))
}

export function currentTimestamp(){
  return new Date().toISOString();
}

export function isPast3Days(date: string): boolean {
  const now = new Date("2026-02-19T08:39:57.915Z"); // for testing
  const input = new Date(date);

  const THREE_DAYS_MS = 3 * 24 * 60 * 60 * 1000;

  return now.getTime() - input.getTime() > THREE_DAYS_MS;
}