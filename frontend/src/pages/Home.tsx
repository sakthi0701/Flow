import { useState } from 'react';
import { format, addHours } from 'date-fns';
import type { FixedEvent } from '../types';

const Home = () => {
  const [events] = useState<FixedEvent[]>([
    {
      id: '1',
      title: 'Physics Lecture',
      start: format(addHours(new Date(), 1), "yyyy-MM-dd'T'HH:mm:ss"),
      end: format(addHours(new Date(), 3), "yyyy-MM-dd'T'HH:mm:ss"),
      location: 'Room 301',
      color: 'blue',
      category: 'class',
    },
    {
      id: '2',
      title: 'Group Project',
      start: format(addHours(new Date(), 5), "yyyy-MM-dd'T'HH:mm:ss"),
      end: format(addHours(new Date(), 6.5), "yyyy-MM-dd'T'HH:mm:ss"),
      location: 'Library',
      color: 'purple',
      category: 'work',
    },
    {
      id: '3',
      title: 'Gym Session',
      start: format(addHours(new Date(), 10), "yyyy-MM-dd'T'HH:mm:ss"),
      end: format(addHours(new Date(), 11), "yyyy-MM-dd'T'HH:mm:ss"),
      location: 'University Gym',
      color: 'green',
      category: 'personal',
    },
  ]);

  const timeSlots = Array.from({ length: 13 }, (_, i) => i + 8);

  const getEventPosition = (event: FixedEvent) => {
    const startHour = new Date(event.start).getHours();
    const endHour = new Date(event.end).getHours();
    const startMinute = new Date(event.start).getMinutes();
    const endMinute = new Date(event.end).getMinutes();

    const top = (startHour - 8) * 96 + (startMinute / 60) * 96 + 24;
    const height =
      (endHour - startHour) * 96 + ((endMinute - startMinute) / 60) * 96 - 8;

    return { top, height };
  };

  const getColorClasses = (color?: string) => {
    switch (color) {
      case 'blue':
        return 'bg-blue-100 dark:bg-blue-900/30 border-blue-400 dark:border-blue-500 text-blue-800 dark:text-blue-100';
      case 'purple':
        return 'bg-purple-100 dark:bg-purple-900/30 border-purple-400 dark:border-purple-500 text-purple-800 dark:text-purple-100';
      case 'green':
        return 'bg-green-100 dark:bg-green-900/30 border-green-400 dark:border-green-500 text-green-800 dark:text-green-100';
      default:
        return 'bg-gray-100 dark:bg-gray-900/30 border-gray-400 dark:border-gray-500 text-gray-800 dark:text-gray-100';
    }
  };

  return (
    <div className="pb-24 h-screen flex flex-col">
      <header className="sticky top-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm z-10 px-6 py-4 shadow-sm">
        <div className="max-w-md mx-auto flex items-center justify-between">
          <button className="text-gray-600 dark:text-gray-300 hover:text-blue-500">
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 256 256">
              <path d="M224,128a8,8,0,0,1-8,8H40a8,8,0,0,1,0-16H216A8,8,0,0,1,224,128ZM40,72H216a8,8,0,0,0,0-16H40a8,8,0,0,0,0,16ZM216,184H40a8,8,0,0,0,0,16H216a8,8,0,0,0,0-16Z" />
            </svg>
          </button>
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">
            {format(new Date(), 'EEEE, d')}
          </h1>
          <button className="text-gray-600 dark:text-gray-300 hover:text-blue-500">
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 256 256">
              <path d="M208,32H184V24a8,8,0,0,0-16,0v8H88V24a8,8,0,0,0-16,0v8H48A16,16,0,0,0,32,48V208a16,16,0,0,0,16,16H208a16,16,0,0,0,16-16V48A16,16,0,0,0,208,32ZM72,48v8a8,8,0,0,0,16,0V48h80v8a8,8,0,0,0,16,0V48h24V80H48V48ZM208,208H48V96H208V208Z" />
            </svg>
          </button>
        </div>
      </header>

      <main className="flex-1 flex flex-col px-4 overflow-y-auto">
        <div className="max-w-md mx-auto w-full flex-1 grid grid-cols-[auto_1fr] gap-x-2">
          <div className="w-12 text-center text-xs text-gray-500 dark:text-gray-400 space-y-[5.5rem]">
            <div className="h-6"></div>
            {timeSlots.map((hour) => (
              <div key={hour}>
                {hour <= 12 ? hour : hour - 12} {hour < 12 ? 'AM' : 'PM'}
              </div>
            ))}
          </div>

          <div className="relative">
            <div className="absolute inset-0 grid grid-rows-[repeat(13,6rem)] -z-10">
              <div className="h-6 border-b border-gray-200 dark:border-gray-700/50"></div>
              {timeSlots.map((hour) => (
                <div
                  key={hour}
                  className="border-b border-gray-200 dark:border-gray-700/50"
                ></div>
              ))}
            </div>

            <div className="relative h-full min-h-[1200px]">
              {events.map((event) => {
                const { top, height } = getEventPosition(event);
                return (
                  <div
                    key={event.id}
                    className="absolute w-full px-2"
                    style={{ top: `${top}px`, height: `${height}px` }}
                  >
                    <div
                      className={`h-full border-l-4 rounded-2xl p-3 flex flex-col justify-between shadow-lg ${getColorClasses(
                        event.color
                      )}`}
                    >
                      <div>
                        <h3 className="font-bold text-sm">{event.title}</h3>
                        {event.location && (
                          <p className="text-xs mt-1 opacity-80">{event.location}</p>
                        )}
                      </div>
                      <p className="text-xs opacity-70 self-end">
                        {format(new Date(event.start), 'h:mm')} -{' '}
                        {format(new Date(event.end), 'h:mm a')}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </main>

      <div className="fixed bottom-24 left-1/2 -translate-x-1/2 w-full max-w-md px-6">
        <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-lg p-3 rounded-3xl shadow-lg flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center">
            <svg
              className="w-6 h-6 text-white"
              fill="currentColor"
              viewBox="0 0 256 256"
            >
              <path d="M200,32H56A16,16,0,0,0,40,48V208a16,16,0,0,0,16,16H200a16,16,0,0,0,16-16V48A16,16,0,0,0,200,32Zm-40,88H136v32a8,8,0,0,1-16,0V120H96a8,8,0,0,1,0-16h24V72a8,8,0,0,1,16,0v32h24a8,8,0,0,1,0,16Z" />
            </svg>
          </div>
          <p className="flex-1 text-sm text-gray-700 dark:text-gray-200">
            What's our focus for today?
          </p>
          <button className="text-gray-500 dark:text-gray-400">
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 256 256">
              <path d="M128,176a48.05,48.05,0,0,0,48-48V64a48,48,0,0,0-96,0v64A48.05,48.05,0,0,0,128,176ZM96,64a32,32,0,0,1,64,0v64a32,32,0,0,1-64,0Zm40,143.6V232a8,8,0,0,1-16,0V207.6A80.11,80.11,0,0,1,48,128a8,8,0,0,1,16,0,64,64,0,0,0,128,0,8,8,0,0,1,16,0A80.11,80.11,0,0,1,136,207.6Z" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Home;
