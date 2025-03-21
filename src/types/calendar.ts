export interface CalendarEvent {
  _id: string;
  title: string;
  start: Date;
  end: Date;
  allDay: boolean;
  description?: string;
  location?: string;
  extendedProps: {
    calendar: string;
    description?: string;
    location?: string;
  };
}

export type CalendarEventCategory = 'Primary' | 'Work' | 'Personal';