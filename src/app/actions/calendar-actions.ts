'use server';

import { revalidatePath } from 'next/cache';
import { CalendarService } from '~/lib/services/calendar-service';
import { z } from 'zod';
import { auth } from '@clerk/nextjs/server';

// Validation schemas
const calendarSchema = z.object({
    name: z.string().min(1),
    description: z.string().optional(),
    color: z
        .string()
        .regex(/^#[0-9A-F]{6}$/i)
        .default('#4285F4'),
    timezone: z.string().default('UTC'),
});

const eventSchema = z.object({
    title: z.string().min(1),
    description: z.string().optional(),
    location: z.string().optional(),
    startTime: z.string().transform((str) => new Date(str)),
    endTime: z.string().transform((str) => new Date(str)),
    isAllDay: z.boolean().default(false),
    calendarId: z.string().uuid(),
});

// Actions
export async function createCalendar(formData: FormData) {
    const session = await auth();
    if (!session || !session.userId) throw new Error('Unauthorized');

    const parsed = calendarSchema.parse(Object.fromEntries(formData));

    const calendar = await CalendarService.createCalendar({
        ...parsed,
        user: { connect: { id: session.userId } },
    });

    revalidatePath('/calendars');
    return calendar;
}

export async function createEvent(formData: FormData) {
    const session = await auth();
    if (!session || !session.userId) throw new Error('Unauthorized');

    const parsed = eventSchema.parse(Object.fromEntries(formData));

    // Check calendar ownership
    const calendar = await CalendarService.getCalendar(parsed.calendarId);
    if (!calendar || calendar.userId !== session.userId) {
        throw new Error('Calendar not found or unauthorized');
    }

    const event = await CalendarService.createEvent({
        ...parsed,
        calendar: { connect: { id: parsed.calendarId } },
    });

    revalidatePath(`/calendars/${parsed.calendarId}`);
    return event;
}
