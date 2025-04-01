import { NextResponse } from 'next/server';
import { db } from '~/server/db';
import { type Prisma } from '@prisma/client';
import { EventStatus, EventTransparency } from '~/lib/types/db-enums';

interface EventInput {
    title: string;
    description?: string;
    startTime: string;
    endTime: string;
    location?: string;
    status: EventStatus;
    transp: EventTransparency;
}

export async function POST(req: Request) {
    try {
        const data = (await req.json()) as EventInput;

        // Validate status and transp
        const validStatus = data.status in EventStatus;
        const validTransp = data.transp in EventTransparency;

        if (!validStatus) {
            return NextResponse.json({ error: 'Invalid event status' }, { status: 400 });
        }

        if (!validTransp) {
            return NextResponse.json({ error: 'Invalid time transparency' }, { status: 400 });
        }

        // For now, we'll use a hardcoded user ID since we haven't set up auth yet
        const TEMP_USER_ID = 'temp-user-id';

        const eventInput: Prisma.EventCreateInput = {
            user: {
                connect: {
                    id: TEMP_USER_ID,
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
        return NextResponse.json(event);
    } catch (error) {
        if (error instanceof Error) {
            console.error('Error creating event:', error.message);
        }
        return NextResponse.json({ error: 'Failed to create event' }, { status: 500 });
    }
}
