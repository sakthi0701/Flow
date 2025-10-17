import { useState } from 'react';
import type { Task, Goal, Class } from '../types';

const Dashboard = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [tasks] = useState<Task[]>([
    {
      id: '1',
      title: 'Complete Math Assignment',
      estimatedMinutes: 90,
      priority: 'urgent-important',
      category: 'Study',
    },
    {
      id: '2',
      title: 'Review Physics Notes',
      estimatedMinutes: 60,
      priority: 'not-urgent-important',
      category: 'Study',
    },
    {
      id: '3',
      title: 'Reply to emails',
      estimatedMinutes: 30,
      priority: 'urgent-not-important',
      category: 'Work',
    },
  ]);

  const [goals] = useState<Goal[]>([
    {
      id: '1',
      title: 'Graduate with Honors',
      linkedTaskCount: 3,
      linkedClassCount: 2,
    },
    {
      id: '2',
      title: 'Learn to Code',
      linkedTaskCount: 5,
      linkedClassCount: 1,
    },
  ]);

  const [classes] = useState<Class[]>([
    {
      id: '1',
      title: 'Advanced Calculus',
      instructor: 'Prof. Alan Turing',
      notes: 'Notes available',
    },
    {
      id: '2',
      title: 'History of Art',
      instructor: 'Prof. Eleanor Vance',
    },
  ]);

  const getPriorityTasks = (priority: string) => {
    return tasks.filter((task) => task.priority === priority);
  };

  const priorityConfig = {
    'urgent-important': {
      title: 'Urgent & Important',
      subtitle: 'Do it now',
      gradient: 'from-green-200 to-emerald-200',
      tasks: getPriorityTasks('urgent-important'),
    },
    'not-urgent-important': {
      title: 'Not Urgent & Important',
      subtitle: 'Schedule it',
      gradient: 'from-blue-200 to-indigo-200',
      tasks: getPriorityTasks('not-urgent-important'),
    },
    'urgent-not-important': {
      title: 'Urgent & Not Important',
      subtitle: 'Delegate it',
      gradient: 'from-yellow-200 to-orange-200',
      tasks: getPriorityTasks('urgent-not-important'),
    },
    'not-urgent-not-important': {
      title: 'Not Urgent & Not Important',
      subtitle: 'Eliminate it',
      gradient: 'from-red-200 to-rose-200',
      tasks: getPriorityTasks('not-urgent-not-important'),
    },
  };

  return (
    <div className="pb-24 min-h-screen bg-gray-50 dark:bg-gray-900">
      <header className="sticky top-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm z-10 p-4 shadow-sm">
        <div className="max-w-md mx-auto">
          <h1 className="text-xl font-bold text-gray-900 dark:text-white text-center">
            Dashboard
          </h1>
        </div>
      </header>

      <main className="max-w-md mx-auto p-4 space-y-6">
        <section>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              Priority Matrix
            </h2>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg py-2 px-3 text-sm text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Categories</option>
              <option value="work">Work</option>
              <option value="personal">Personal</option>
              <option value="study">Study</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {Object.entries(priorityConfig).map(([key, config]) => (
              <div
                key={key}
                className={`bg-gradient-to-br ${config.gradient} p-4 rounded-2xl shadow-sm min-h-[120px] flex flex-col`}
              >
                <h3 className="font-bold text-gray-800 text-sm">{config.title}</h3>
                <p className="text-xs text-gray-600 mt-1">{config.subtitle}</p>
                <div className="mt-3 flex-1">
                  {config.tasks.length > 0 ? (
                    <div className="space-y-1">
                      {config.tasks.slice(0, 2).map((task) => (
                        <div
                          key={task.id}
                          className="text-xs bg-white/50 rounded-lg px-2 py-1"
                        >
                          {task.title}
                        </div>
                      ))}
                      {config.tasks.length > 2 && (
                        <div className="text-xs text-gray-600 font-medium">
                          +{config.tasks.length - 2} more
                        </div>
                      )}
                    </div>
                  ) : (
                    <p className="text-xs text-gray-500 italic">No tasks</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
            Goals
          </h2>
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-sm space-y-4">
            {goals.map((goal) => (
              <div key={goal.id} className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-gray-800 dark:text-gray-200">
                    {goal.title}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Linked to: {goal.linkedTaskCount} tasks, {goal.linkedClassCount}{' '}
                    classes
                  </p>
                </div>
                <button className="text-blue-500 hover:text-blue-600">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 256 256">
                    <path d="M224,128a8,8,0,0,1-8,8H136v80a8,8,0,0,1-16,0V136H40a8,8,0,0,1,0-16h80V40a8,8,0,0,1,16,0v80h80A8,8,0,0,1,224,128Z" />
                  </svg>
                </button>
              </div>
            ))}
            <div className="text-center pt-2">
              <button className="text-blue-500 font-semibold text-sm hover:text-blue-600">
                + Define New Goal
              </button>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
            Classes
          </h2>
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-sm space-y-4">
            {classes.map((cls) => (
              <div key={cls.id} className="flex items-center justify-between">
                <div className="flex-1">
                  <h3 className="font-bold text-gray-800 dark:text-gray-200">
                    {cls.title}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {cls.instructor || 'No instructor'}
                  </p>
                  {cls.notes && (
                    <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                      {cls.notes}
                    </p>
                  )}
                </div>
                <button className="text-blue-500 font-semibold text-sm hover:text-blue-600">
                  AI Tasks
                </button>
              </div>
            ))}
            <div className="text-center pt-2">
              <button className="text-blue-500 font-semibold text-sm hover:text-blue-600">
                + Add Class
              </button>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Dashboard;
