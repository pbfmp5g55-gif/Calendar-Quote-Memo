'use client';

import { useState, useEffect } from 'react';
import {
    format, addMonths, subMonths, startOfMonth, endOfMonth,
    eachDayOfInterval, isSameMonth, isSameDay, isToday,
    startOfWeek, endOfWeek
} from 'date-fns';
import { ja } from 'date-fns/locale';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import clsx from 'clsx';
import { twMerge } from 'tailwind-merge';

interface CalendarViewProps {
    selectedDate: Date | null;
    onSelectDate: (date: Date) => void;
    className?: string;
    refreshKey?: number; // Trigger re-fetch
}

export default function CalendarView({ selectedDate, onSelectDate, className, refreshKey }: CalendarViewProps) {
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const [memoDates, setMemoDates] = useState<Set<string>>(new Set());
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchMemos = async () => {
            setLoading(true);
            // Fetch buffer around month to cover grid
            const viewStart = startOfWeek(startOfMonth(currentMonth));
            const viewEnd = endOfWeek(endOfMonth(currentMonth));

            try {
                const res = await fetch(`/api/memos?from=${viewStart.toISOString()}&to=${viewEnd.toISOString()}`);
                if (!res.ok) throw new Error('Failed to fetch');
                const data = await res.json();
                if (Array.isArray(data)) {
                    // backend returns date strings or objects
                    const set = new Set(data.map((d: any) => new Date(d.date).toISOString().split('T')[0]));
                    setMemoDates(set);
                }
            } catch (e) {
                console.error(e);
            } finally {
                setLoading(false);
            }
        };
        fetchMemos();
    }, [currentMonth, refreshKey]);

    const viewStart = startOfWeek(startOfMonth(currentMonth));
    const viewEnd = endOfWeek(endOfMonth(currentMonth));
    const days = eachDayOfInterval({ start: viewStart, end: viewEnd });

    const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));
    const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));

    const weekDays = ['日', '月', '火', '水', '木', '金', '土'];

    return (
        <div className={twMerge("p-4 md:p-6 glass-card border border-white/20", className)}>
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl md:text-2xl font-bold text-foreground">
                    {format(currentMonth, 'yyyy年 M月', { locale: ja })}
                </h2>
                <div className="flex gap-2">
                    <button onClick={prevMonth} className="p-2 hover:bg-muted rounded-full transition-colors active:scale-95">
                        <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button onClick={nextMonth} className="p-2 hover:bg-muted rounded-full transition-colors active:scale-95">
                        <ChevronRight className="w-5 h-5" />
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-7 mb-2 text-center text-muted-foreground text-sm font-medium">
                {weekDays.map(d => <div key={d} className="py-2">{d}</div>)}
            </div>

            <motion.div
                key={currentMonth.toISOString()}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="grid grid-cols-7 gap-1"
            >
                {days.map((day) => {
                    const dateStr = format(day, 'yyyy-MM-dd');
                    const isCurrentMonth = isSameMonth(day, currentMonth);
                    const hasMemo = memoDates.has(dateStr);
                    const isSelected = selectedDate && isSameDay(day, selectedDate);
                    const isTodayDate = isToday(day);

                    return (
                        <button
                            key={day.toISOString()}
                            onClick={() => onSelectDate(day)}
                            className={clsx(
                                "h-10 md:h-12 w-full flex flex-col items-center justify-center rounded-lg relative transition-all duration-200",
                                !isCurrentMonth && "text-muted-foreground/30",
                                isCurrentMonth && "text-foreground hover:bg-muted/50",
                                isSelected && "bg-primary text-primary-foreground shadow-md hover:bg-primary/90! scale-105",
                                isTodayDate && !isSelected && "text-primary font-bold bg-primary/10"
                            )}
                        >
                            <span className="text-sm">{format(day, 'd')}</span>
                            {hasMemo && (
                                <span className={clsx(
                                    "absolute bottom-2 w-1.5 h-1.5 rounded-full",
                                    isSelected ? "bg-white" : "bg-accent"
                                )} />
                            )}
                        </button>
                    );
                })}
            </motion.div>
        </div>
    );
}
