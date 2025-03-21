import { API_CONFIG } from "../config/api.config";
import { CalendarEvent, CalendarEventCategory } from "../types/calendar.types";

export class MongoDbService {
  private readonly baseUrl: string;
  private headers: HeadersInit;

  constructor(accessToken: string) {
    this.baseUrl = API_CONFIG.BASE_URL;
    this.headers = {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json'
    };
    console.debug('[MongoDBService] Initialized with token:', accessToken ? 'Present' : 'Missing');
  }

  async getEvents(start: Date, end: Date) {
    console.group('📡 [MongoDBService.getEvents]');
    try {
      const url = `${this.baseUrl}${API_CONFIG.ENDPOINTS.CALENDAR}?start=${start.toISOString()}&end=${end.toISOString()}`;
      console.debug('Fetching from URL:', url);
      console.debug('Using headers:', { ...this.headers, Authorization: 'Bearer [REDACTED]' });

      const response = await fetch(url, { headers: this.headers });
      console.debug('Response status:', response.status);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.debug('Received data:', data);
      return data;
    } catch (error) {
      console.error('Error in getEvents:', error);
      throw error;
    } finally {
      console.groupEnd();
    }
  }

  async createEvent(eventData: {
    title: string;
    start: Date;
    end: Date;
    calendar: CalendarEventCategory;
    description?: string;
    location?: string;
    allDay?: boolean;
  }) {
    const response = await fetch(
      `${this.baseUrl}${API_CONFIG.ENDPOINTS.CALENDAR}`,
      {
        method: 'POST',
        headers: this.headers,
        body: JSON.stringify(eventData)
      }
    );
    return await response.json();
  }

  async updateEvent(
    eventId: string,
    eventData: {
      title: string;
      start: Date;
      end: Date;
      calendar: CalendarEventCategory;
      description?: string;
      location?: string;
    }
  ) {
    const response = await fetch(
      `${this.baseUrl}${API_CONFIG.ENDPOINTS.CALENDAR_EVENT(eventId)}`,
      {
        method: 'PUT',
        headers: this.headers,
        body: JSON.stringify(eventData)
      }
    );
    return await response.json();
  }
}

