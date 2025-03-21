export type CalendarEventCategory = 'Danger' | 'Success' | 'Primary' | 'Warning';

export interface CalendarEvent {
  _id?: string;
  title: string;
  start: Date;
  end?: Date;
  allDay: boolean;
  extendedProps: {
    calendar: CalendarEventCategory;
  };
  userId: string;
  description?: string;
  location?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface CalendarEventInput {
  title: string;
  start: Date;
  end?: Date;
  allDay?: boolean;
  calendar: CalendarEventCategory;
  description?: string;
  location?: string;
}

export interface CalendarEventResponse {
  success: boolean;
  event?: CalendarEvent;
  error?: string;
}

export interface CalendarEventsResponse {
  success: boolean;
  events?: CalendarEvent[];
  error?: string;
}