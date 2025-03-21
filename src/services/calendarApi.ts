import { API_CONFIG } from '../config/api.config';
import { CalendarEvent, CalendarEventInput, CalendarEventResponse, CalendarEventsResponse } from '../types/calendar.types';

export const useCalendarApi = (getAccessToken: () => Promise<string>) => {
  const getHeaders = async () => {
    console.debug('[Calendar API] Getting auth headers');
    const token = await getAccessToken();
    return {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    };
  };

  const createEvent = async (eventData: CalendarEventInput): Promise<CalendarEventResponse> => {
    try {
      console.debug('[Calendar API] Creating event:', eventData);
      const headers = await getHeaders();
      const response = await fetch(`${API_CONFIG.BASE_URL}/calendar`, {
        method: 'POST',
        headers,
        body: JSON.stringify(eventData),
      });
      const data = await response.json();
      console.debug('[Calendar API] Create event response:', data);
      return data;
    } catch (error) {
      console.error('[Calendar API] Error creating event:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to create event'
      };
    }
  };

  const getEvents = async (start: Date, end: Date): Promise<CalendarEventsResponse> => {
    try {
      console.group('📡 [Calendar API] Fetching Events');
      console.debug('Request parameters:', {
        start: start.toISOString(),
        end: end.toISOString()
      });

      const headers = await getHeaders();
      console.debug('Request headers:', headers);

      const url = `${API_CONFIG.BASE_URL}/calendar?start=${start.toISOString()}&end=${end.toISOString()}`;
      console.debug('Request URL:', url);

      const response = await fetch(url, { headers });
      console.debug('Raw response:', response);

      const data = await response.json();
      console.debug('Response data:', data);

      console.groupEnd();
      return data;
    } catch (error) {
      console.error('[Calendar API] Error fetching events:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch events'
      };
    }
  };

  const updateEvent = async (eventId: string, eventData: Partial<CalendarEventInput>): Promise<CalendarEventResponse> => {
    try {
      const headers = await getHeaders();
      const response = await fetch(`${API_CONFIG.BASE_URL}/calendar/${eventId}`, {
        method: 'PATCH',
        headers,
        body: JSON.stringify(eventData),
      });
      return await response.json();
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to update event'
      };
    }
  };

  const deleteEvent = async (eventId: string): Promise<CalendarEventResponse> => {
    try {
      const headers = await getHeaders();
      const response = await fetch(`${API_CONFIG.BASE_URL}/calendar/${eventId}`, {
        method: 'DELETE',
        headers,
      });
      return await response.json();
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to delete event'
      };
    }
  };

  return {
    createEvent,
    getEvents,
    updateEvent,
    deleteEvent,
  };
};


