import { format, addDays, startOfWeek, addWeeks, isSameDay } from 'date-fns';
import { motion } from 'framer-motion';
import { Calendar as CalendarIcon, Clock } from 'lucide-react';

interface Task {
    id: string;
    title: string;
    status: 'todo' | 'in-progress' | 'done';
    priority: 'low' | 'medium' | 'high';
    due_date?: string;
    start_date?: string;
}

interface TimelineViewProps {
    tasks: Task[];
}

export function TimelineView({ tasks }: TimelineViewProps) {
    // Generate next 14 days for the timeline
    const today = new Date();
    const days = Array.from({ length: 14 }, (_, i) => addDays(today, i));

    const getTaskStyle = (task: Task) => {
        // Mocking duration based on random logic or if we had start/end date
        // For now, let's assume all tasks are 2 days long for visualization if no range
        return "col-span-2";
    };

    return (
        <div className="h-full flex flex-col bg-[#0a0a0a]">
            {/* Timeline Header */}
            <div className="flex border-b border-[#222]">
                <div className="w-64 flex-shrink-0 p-4 border-r border-[#222] bg-[#111]">
                    <span className="text-xs font-bold text-zinc-500 uppercase">Task Name</span>
                </div>
                <div className="flex-1 overflow-x-auto custom-scrollbar">
                    <div className="flex min-w-max">
                        {days.map((day) => (
                            <div key={day.toISOString()} className="w-32 border-r border-[#222] p-2 text-center bg-[#111]">
                                <div className="text-xs font-medium text-zinc-400">{format(day, 'EEE')}</div>
                                <div className={`text-sm font-bold ${isSameDay(day, today) ? 'text-indigo-400' : 'text-zinc-500'}`}>
                                    {format(day, 'd MMM')}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Timeline Body */}
            <div className="flex-1 overflow-y-auto">
                {tasks.map((task) => (
                    <div key={task.id} className="flex border-b border-[#222] hover:bg-[#111]/50 transition-colors group">
                        <div className="w-64 flex-shrink-0 p-3 border-r border-[#222] flex items-center gap-3">
                            <div className={`w-2 h-2 rounded-full ${task.status === 'done' ? 'bg-green-500' :
                                task.status === 'in-progress' ? 'bg-yellow-500' : 'bg-zinc-500'
                                }`} />
                            <span className="text-sm text-zinc-300 truncate font-medium">{task.title}</span>
                        </div>

                        <div className="flex-1 overflow-hidden relative py-3">
                            {/* Grid Lines Background */}
                            <div className="absolute inset-0 flex pointer-events-none">
                                {days.map((_, i) => (
                                    <div key={i} className="w-32 flex-shrink-0 border-r border-[#222]/30 h-full" />
                                ))}
                            </div>

                            {/* Task Bar */}
                            <motion.div
                                initial={{ width: 0, opacity: 0 }}
                                animate={{ width: "100%", opacity: 1 }}
                                className="relative h-8"
                            >
                                {(() => {
                                    if (!task.due_date) return null; // Don't show if no due date

                                    const taskDate = new Date(task.due_date);

                                    // If invalid date, skip
                                    if (isNaN(taskDate.getTime())) return null;

                                    // Check difference in days from start of timeline
                                    const diffDays = Math.floor((taskDate.getTime() - days[0].getTime()) / (1000 * 60 * 60 * 24));

                                    // Only render if within the viewing range (0 to 13)
                                    if (diffDays >= 0 && diffDays < 14) {
                                        return (
                                            <div
                                                className={`absolute top-0 h-full rounded-md border text-xs flex items-center px-3 shadow-lg truncate ${task.priority === 'high' ? 'bg-red-900/30 border-red-500/50 text-red-200' :
                                                    task.priority === 'medium' ? 'bg-orange-900/30 border-orange-500/50 text-orange-200' :
                                                        'bg-blue-900/30 border-blue-500/50 text-blue-200'
                                                    }`}
                                                style={{
                                                    left: `${diffDays * 128 + 8}px`, // 128px per day column + slight offset
                                                    width: '110px' // Slightly less than a full day column
                                                }}
                                                title={task.title}
                                            >
                                                <Clock className="w-3 h-3 mr-2 opacity-50 flex-shrink-0" />
                                                <span className="truncate">{task.title}</span>
                                            </div>
                                        );
                                    }
                                    return null;
                                })()}
                            </motion.div>
                        </div>
                    </div>
                ))}

                {tasks.length === 0 && (
                    <div className="p-10 text-center text-zinc-500">
                        No tasks to display on timeline.
                    </div>
                )}
            </div>
        </div>
    );
}
