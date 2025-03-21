import React, { useEffect, useState, useRef, useCallback } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { EventApi, EventClickArg } from "@fullcalendar/core";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { useMongoDbClient } from "../services/mongoDbClient";
import { useModal } from "../hooks/useModal";
import { toast } from "react-toastify";
import PageMeta from "../components/common/PageMeta";
import Flatpickr from "react-flatpickr";
import { CalenderIcon } from "../icons";
import { getEndOfDay } from "../utils/dateUtils";
import { CalendarEvent, CalendarEventCategory } from "../types/calendar.types";
import { Modal } from "../components/ui/modal";

interface EventClickInfo extends Omit<EventClickArg, "event"> {
  event: EventApi & {
    extendedProps: {
      calendar: string;
      description?: string;
      location?: string;
    };
  };
}

interface DateSelectInfo {
  start: Date;
  end: Date;
  allDay: boolean;
}

const Calendar: React.FC = () => {
  const { getAccessTokenSilently } = useAuth0();
  const mongoDbClient = useMongoDbClient();
  const [isLoading, setIsLoading] = useState(true);
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [accessToken, setAccessToken] = useState<string>("");
  const calendarRef = useRef<any>(null);

  // Memoize the initial dates
  const [viewDates, setViewDates] = useState<{ start: Date; end: Date }>(() => {
    const today = new Date();
    return {
      start: new Date(today.getFullYear(), today.getMonth(), 1),
      end: new Date(today.getFullYear(), today.getMonth() + 1, 0),
    };
  });

  const { isOpen, openModal, closeModal } = useModal();
  const [selectedDates, setSelectedDates] = useState<DateSelectInfo | null>(null);
  const [eventDates, setEventDates] = useState(() => ({
    start: new Date().toISOString(),
    end: getEndOfDay(new Date()).toISOString(),
    allDay: true,
  }));

  const fetchEvents = useCallback(async (start: Date, end: Date, token: string) => {
    if (!token) return;

    setIsLoading(true);
    try {
      const response = await mongoDbClient.getEvents(start, end, token);

      if (response.success && response.events) {
        setEvents(
          response.events.map((event: CalendarEvent) => ({
            id: event._id,
            title: event.title,
            start: event.start,
            end: event.end,
            allDay: event.allDay,
            extendedProps: {
              calendar: event.extendedProps.calendar,
              description: event.description,
              location: event.location,
            },
          }))
        );
      } else {
        toast.error("Failed to fetch events");
      }
    } catch (error) {
      console.error("Error fetching events:", error);
      toast.error("Error loading events");
    } finally {
      setIsLoading(false);
    }
  }, [mongoDbClient]);

  useEffect(() => {
    const initToken = async () => {
      try {
        const token = await getAccessTokenSilently();
        setAccessToken(token);
      } catch (error) {
        console.error("Failed to initialize calendar:", error);
        toast.error("Failed to initialize calendar");
      }
    };

    initToken();
  }, [getAccessTokenSilently]);

  const handleDatesSet = useCallback((dateInfo: any) => {
    const roundedStart = new Date(dateInfo.start).setHours(0, 0, 0, 0);
    const roundedEnd = new Date(dateInfo.end).setHours(23, 59, 59, 999);

    setViewDates((prev) => {
      const prevStart = new Date(prev.start).setHours(0, 0, 0, 0);
      const prevEnd = new Date(prev.end).setHours(23, 59, 59, 999);
      return prevStart === roundedStart && prevEnd === roundedEnd
        ? prev
        : { start: new Date(roundedStart), end: new Date(roundedEnd) };
    });
  }, []);

  useEffect(() => {
    if (!accessToken) return;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => {
      fetchEvents(viewDates.start, viewDates.end, accessToken);
    }, 100);

    return () => {
      controller.abort();
      clearTimeout(timeoutId);
    };
  }, [accessToken, viewDates, fetchEvents]);

  const handleEventClick = (clickInfo: EventClickArg) => {
    console.log("Event clicked:", clickInfo);
  };

  const handleDateSelect = (selectInfo: DateSelectInfo) => {
    setSelectedDates(selectInfo);
    openModal();
  };

  useEffect(() => {
    setEventDates(() => ({
      start: selectedDates?.start.toISOString() ?? new Date().toISOString(),
      end: selectedDates?.end.toISOString() ?? getEndOfDay(new Date()).toISOString(),
      allDay: selectedDates?.allDay ?? true,
    }));
  }, [selectedDates]);

  const renderEventContent = (eventInfo: any) => (
    <div className="fc-event-main-content">
      <div className="fc-event-title">{eventInfo.event.title}</div>
    </div>
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
          <p className="mt-4">Loading Calendar...</p>
        </div>
      </div>
    );
  }

  const handleCreateEvent = async (eventData: CalendarEventCategory & { title: string; description?: string; location?: string }) => {
    try {
      const response = await mongoDbClient.createEvent(
        {
          title: eventData.title,
          description: eventData.description,
          location: eventData.location,
          calendar: eventData,  // eventData itself is the calendar category
          start: new Date(eventDates.start),
          end: new Date(eventDates.end),
          allDay: eventDates.allDay,
        },
        accessToken
      );

      if (response.success) {
        toast.success("Event created successfully");
        closeModal();
        fetchEvents(viewDates.start, viewDates.end, accessToken);
      } else {
        toast.error("Failed to create event");
      }
    } catch (error) {
      console.error("Error creating event:", error);
      toast.error("Error creating event");
    }
  };

  return (
    <>
      <PageMeta
        title="Calendar Dashboard"
        description="Calendar Dashboard page"
      />
      <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
        <div className="custom-calendar p-4">
          <FullCalendar
            ref={calendarRef}
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
            initialView="dayGridMonth"
            headerToolbar={{
              left: "prev,next",
              center: "title",
              right: "dayGridMonth,timeGridWeek,timeGridDay",
            }}
            events={events}
            selectable={true}
            select={handleDateSelect}
            eventClick={handleEventClick}
            eventContent={renderEventContent}
            datesSet={handleDatesSet}
          />
        </div>
      </div>

      <Modal isOpen={isOpen} onClose={closeModal} className="!w-[33vw]">
        <div className="p-6 bg-white rounded-lg dark:bg-gray-800">
          <h2 className="text-xl font-semibold mb-4">Create New Event</h2>
          <form
            onSubmit={(e: React.FormEvent<HTMLFormElement>) => {
              e.preventDefault();
              const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
                e.preventDefault();
              
                // Helper function to safely retrieve form elements
                const getFormElementValue = <T extends HTMLElement>(
                  name: string,
                  typeAssertion: (element: Element) => T
                ): string | undefined => {
                  const element = e.currentTarget.elements.namedItem(name);
                  return element ? (typeAssertion(element).value || undefined) : undefined;
                };
              
                const calendarValue = getFormElementValue(
                  "calendar",
                  (element) => element as HTMLSelectElement
                ) as CalendarEventCategory;
              
                handleCreateEvent({
                  calendar: calendarValue, // Use the value directly as the calendar property
                  title: getFormElementValue(
                    "title",
                    (element) => element as HTMLInputElement
                  ) as string,
                  description: getFormElementValue(
                    "description",
                    (element) => element as HTMLTextAreaElement
                  ),
                  location: getFormElementValue(
                    "location",
                    (element) => element as HTMLInputElement
                  ),
                });
              };
              
            }}
          >
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                  All Day Event
                </label>
                <input
                  type="checkbox"
                  checked={eventDates.allDay}
                  onChange={(e) =>
                    setEventDates((prev) => ({
                      ...prev,
                      allDay: e.target.checked,
                    }))
                  }
                  className="rounded border-gray-300 text-primary focus:ring-primary"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                  Start Date {!eventDates.allDay && "& Time"}
                </label>
                <div className="relative">
                  <Flatpickr
                    value={eventDates.start}
                    onChange={([date]) =>
                      setEventDates((prev) => ({
                        ...prev,
                        start: date.toISOString(),
                      }))
                    }
                    options={{
                      enableTime: !eventDates.allDay,
                      dateFormat: eventDates.allDay ? "Y-m-d" : "Y-m-d H:i",
                      time_24hr: true,
                      clickOpens: true,
                      allowInput: true,
                      defaultDate: new Date().toISOString(), // Ensures today's date is correctly applied
                    }}
                    className="h-11 w-full rounded-lg border appearance-none px-4 py-2.5 text-sm shadow-theme-xs placeholder:text-gray-400 focus:outline-hidden focus:ring-3 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 bg-transparent text-gray-800 border-gray-300 focus:border-brand-300 focus:ring-brand-500/20 dark:border-gray-700 dark:focus:border-brand-800"
                  />

                  <span className="absolute text-gray-500 -translate-y-1/2 cursor-pointer right-3 top-1/2 dark:text-gray-400">
                    <CalenderIcon className="size-6" />
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                  End Date {!eventDates.allDay && "& Time"}
                </label>
                <div className="relative">
                <Flatpickr
                    value={eventDates.end}
                    onChange={([date]) =>
                      setEventDates((prev) => ({
                        ...prev,
                        end: date.toISOString(),
                      }))
                    }
                    options={{
                      enableTime: !eventDates.allDay,
                      dateFormat: eventDates.allDay ? "Y-m-d" : "Y-m-d H:i",
                      time_24hr: true,
                      clickOpens: true,
                      allowInput: true,
                      defaultDate: new Date().toISOString(), // Ensures today's date is correctly applied
                    }}
                    className="h-11 w-full rounded-lg border appearance-none px-4 py-2.5 text-sm shadow-theme-xs placeholder:text-gray-400 focus:outline-hidden focus:ring-3 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 bg-transparent text-gray-800 border-gray-300 focus:border-brand-300 focus:ring-brand-500/20 dark:border-gray-700 dark:focus:border-brand-800"
                  />
                  <span className="absolute text-gray-500 -translate-y-1/2 cursor-pointer right-3 top-1/2 dark:text-gray-400">
                    <CalenderIcon className="size-6" />
                  </span>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                  Title
                </label>
                <input
                  name="title"
                  type="text"
                  className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                  Calendar
                </label>
                <select
                  name="calendar"
                  className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300"
                  required
                >
                  <option value="Primary">Primary</option>
                  <option value="Work">Work</option>
                  <option value="Personal">Personal</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                  Description
                </label>
                <textarea
                  name="description"
                  className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300"
                  rows={3}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                  Location
                </label>
                <input
                  name="location"
                  type="text"
                  className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300"
                />
              </div>
            </div>
            <div className="mt-6 flex justify-end gap-4">
              <button
                type="button"
                onClick={closeModal}
                className="px-4 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-600"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2.5 text-sm font-medium text-white bg-brand-500 border border-transparent rounded-lg hover:bg-brand-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-500 dark:bg-brand-600 dark:hover:bg-brand-700"
              >
                Create Event
              </button>
            </div>
          </form>
        </div>
      </Modal>
    </>
  );

};

export default Calendar;

























