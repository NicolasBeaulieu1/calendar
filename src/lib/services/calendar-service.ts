import 'server-only';

import type { Calendar, Event, Prisma } from '@prisma/client';
import { db } from '~/server/db';

export type CalendarWithEvents = Calendar & {
    events: Event[];
};

export class CalendarService {
    // Calendar operations
    static async createCalendar(data: Prisma.CalendarCreateInput): Promise<Calendar> {
        return db.calendar.create({ data });
    }

    static async getCalendars(userId: string): Promise<Calendar[]> {
        return db.calendar.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' },
        });
    }

    static async getCalendar(id: string): Promise<CalendarWithEvents | null> {
        return db.calendar.findUnique({
            where: { id },
            include: { events: true },
        });
    }

    // Event operations
    static async createEvent(data: Prisma.EventCreateInput): Promise<Event> {
        return db.event.create({ data });
    }

    static async getEvents(calendarId: string, startDate?: Date, endDate?: Date): Promise<Event[]> {
        const where: Prisma.EventWhereInput = { calendarId };

        if (startDate || endDate) {
            where.OR = [
                // Regular events within range
                {
                    startTime: { gte: startDate },
                    endTime: { lte: endDate },
                },
                // Events that span the range
                {
                    startTime: { lte: startDate },
                    endTime: { gte: endDate },
                },
            ];
        }

        return db.event.findMany({
            where,
            orderBy: { startTime: 'asc' },
        });
    }
}
