'use server';

import { type Prisma } from '@prisma/client';
import { db } from '~/server/db';
import { EventStatus, EventTransparency } from '~/lib/types/db-enums';
import { revalidatePath } from 'next/cache';

export interface EventInput {
    title: string;
    description?: string;
    startTime: string;
    endTime: string;
    location?: string;
    status: EventStatus;
    transp: EventTransparency;
    userId?: string; // Optional to support different auth contexts
}

export async function createEvent(data: EventInput) {
    try {
        // Validate status and transp
        const validStatus = Object.values(EventStatus).includes(data.status);
        const validTransp = Object.values(EventTransparency).includes(data.transp);

        if (!validStatus) {
            throw new Error('Invalid event status');
        }

        if (!validTransp) {
            throw new Error('Invalid time transparency');
        }

        // For now, we'll use a hardcoded user ID since we haven't set up auth yet
        const userId = data.userId ?? 'temp-user-id';

        const eventInput: Prisma.EventCreateInput = {
            user: {
                connect: {
                    id: userId,
                },
            },
            title: data.title,
            description: data.description ?? null,
            startTime: new Date(data.startTime),
            endTime: new Date(data.endTime),
            location: data.location ?? null,
            status: data.status,
            transp: data.transp,
        };

        const event = await db.event.create({ data: eventInput });

        // Revalidate the events page to show the new event
        revalidatePath('/events');

        return { event, error: null };
    } catch (error) {
        console.error(
            'Error creating event:',
            error instanceof Error ? error.message : String(error)
        );
        return {
            event: null,
            error: error instanceof Error ? error.message : 'Failed to create event',
        };
    }
}
