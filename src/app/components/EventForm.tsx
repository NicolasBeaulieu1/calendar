'use client';

import { useState } from 'react';
import { EventStatus, EventTransparency } from '~/lib/types/db-enums';
import { createEvent } from '~/server/actions/events';

interface FormData {
    title: string;
    description: string;
    startTime: string;
    endTime: string;
    location: string;
    status: EventStatus;
    transp: EventTransparency;
}

const initialFormData: FormData = {
    title: '',
    description: '',
    startTime: '',
    endTime: '',
    location: '',
    status: EventStatus.CONFIRMED,
    transp: EventTransparency.OPAQUE,
};

export default function EventForm() {
    const [formData, setFormData] = useState<FormData>(initialFormData);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const { event, error } = await createEvent(formData);
        if (error) {
            alert('Failed to create event');
        } else {
            setFormData(initialFormData);
            alert('Event created successfully!');
        }
    };

    const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const value = e.target.value;
        if (value in EventStatus) {
            setFormData({ ...formData, status: value as EventStatus });
        }
    };

    const handleTranspChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const value = e.target.value;
        if (value in EventTransparency) {
            setFormData({ ...formData, transp: value as EventTransparency });
        }
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="space-y-4 w-full max-w-md p-6 bg-white rounded-lg shadow"
        >
            <div>
                <label
                    htmlFor="title"
                    className="block text-sm font-medium text-gray-700"
                >
                    Title
                </label>
                <input
                    type="text"
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    required
                />
            </div>

            <div>
                <label
                    htmlFor="description"
                    className="block text-sm font-medium text-gray-700"
                >
                    Description
                </label>
                <textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    rows={3}
                />
            </div>

            <div>
                <label
                    htmlFor="startTime"
                    className="block text-sm font-medium text-gray-700"
                >
                    Start Time
                </label>
                <input
                    type="datetime-local"
                    id="startTime"
                    value={formData.startTime}
                    onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    required
                />
            </div>

            <div>
                <label
                    htmlFor="endTime"
                    className="block text-sm font-medium text-gray-700"
                >
                    End Time
                </label>
                <input
                    type="datetime-local"
                    id="endTime"
                    value={formData.endTime}
                    onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    required
                />
            </div>

            <div>
                <label
                    htmlFor="location"
                    className="block text-sm font-medium text-gray-700"
                >
                    Location
                </label>
                <input
                    type="text"
                    id="location"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
            </div>

            <div>
                <label
                    htmlFor="status"
                    className="block text-sm font-medium text-gray-700"
                >
                    Status
                </label>
                <select
                    id="status"
                    value={formData.status}
                    onChange={handleStatusChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                >
                    <option value={EventStatus.CONFIRMED}>Confirmed</option>
                    <option value={EventStatus.TENTATIVE}>Tentative</option>
                    <option value={EventStatus.CANCELLED}>Cancelled</option>
                </select>
            </div>

            <div>
                <label
                    htmlFor="transp"
                    className="block text-sm font-medium text-gray-700"
                >
                    Time Transparency
                </label>
                <select
                    id="transp"
                    value={formData.transp}
                    onChange={handleTranspChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                >
                    <option value={EventTransparency.OPAQUE}>Busy</option>
                    <option value={EventTransparency.TRANSPARENT}>Free</option>
                </select>
            </div>

            <button
                type="submit"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
                Create Event
            </button>
        </form>
    );
}
