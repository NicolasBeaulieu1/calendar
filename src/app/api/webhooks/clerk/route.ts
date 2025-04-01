import { Webhook } from 'svix';
import { headers } from 'next/headers';
import type { WebhookEvent } from '@clerk/nextjs/server';
import { env } from '~/env';
import { db } from '~/server/db';

export async function POST(req: Request) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call
    const wh = new Webhook(env.SIGNING_SECRET);

    const headerPayload = await headers();
    const svix_id = headerPayload.get('svix-id');
    const svix_timestamp = headerPayload.get('svix-timestamp');
    const svix_signature = headerPayload.get('svix-signature');

    if (!svix_id || !svix_timestamp || !svix_signature) {
        return new Response('Error: Missing Svix headers', {
            status: 400,
        });
    }

    const payload = (await req.json()) as Record<string, unknown>;
    const body = JSON.stringify(payload);

    let evt: WebhookEvent;

    try {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
        evt = wh.verify(body, {
            'svix-id': svix_id,
            'svix-timestamp': svix_timestamp,
            'svix-signature': svix_signature,
        }) as WebhookEvent;
    } catch (err) {
        console.error('Error: Could not verify webhook:', err);
        return new Response('Error: Verification error', {
            status: 400,
        });
    }

    if (evt.type === 'user.created') {
        const { id, email_addresses, first_name, last_name, username, image_url } = evt.data;
        const name = `${first_name ?? ''} ${last_name ?? ''}`.trim() ?? username ?? '';
        await db.user.create({
            data: {
                id,
                name,
                email: email_addresses[0]?.email_address ?? '',
                username,
                clerkId: id,
                clerkRole: 'user',
                imageUrl: image_url,
            },
        });
    }

    return new Response('Webhook received', { status: 200 });
}
