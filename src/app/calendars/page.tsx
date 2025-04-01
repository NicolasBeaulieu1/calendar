import { CalendarService } from '~/lib/services/calendar-service';
import { createCalendar } from '~/app/actions/calendar-actions';
import { auth } from '@clerk/nextjs/server';

export default async function CalendarsPage() {
    const session = await auth();
    if (!session || !session.userId) return <div>Please log in</div>;

    const calendars = await CalendarService.getCalendars(session.userId);

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">My Calendars</h1>

            <form
                action={async (formData) => {
                    'use server';
                    await createCalendar(formData);
                }}
                className="mb-6 p-4 border rounded"
            >
                <h2 className="text-lg font-semibold mb-2">Create New Calendar</h2>
                <div className="grid gap-4">
                    <div>
                        <label
                            htmlFor="name"
                            className="block mb-1"
                        >
                            Name
                        </label>
                        <input
                            id="name"
                            name="name"
                            type="text"
                            required
                            className="w-full p-2 border rounded"
                        />
                    </div>
                    <div>
                        <label
                            htmlFor="description"
                            className="block mb-1"
                        >
                            Description
                        </label>
                        <textarea
                            id="description"
                            name="description"
                            className="w-full p-2 border rounded"
                        />
                    </div>
                    <div>
                        <label
                            htmlFor="color"
                            className="block mb-1"
                        >
                            Color
                        </label>
                        <input
                            id="color"
                            name="color"
                            type="color"
                            defaultValue="#4285F4"
                            className="p-1 border rounded"
                        />
                    </div>
                    <button
                        type="submit"
                        className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
                    >
                        Create Calendar
                    </button>
                </div>
            </form>

            <div className="grid gap-4">
                {calendars.map((calendar) => (
                    <div
                        key={calendar.id}
                        className="p-4 border rounded"
                    >
                        <div className="flex items-center gap-2">
                            <div
                                className="w-4 h-4 rounded-full"
                                style={{ backgroundColor: calendar.color }}
                            />
                            <h3 className="font-semibold">{calendar.name}</h3>
                        </div>
                        {calendar.description && (
                            <p className="text-gray-600 mt-1">{calendar.description}</p>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}
