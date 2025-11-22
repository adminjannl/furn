import { useState, useRef, useEffect } from 'react';
import { Calendar, ChevronLeft, ChevronRight } from 'lucide-react';

interface DatePickerProps {
  value: string;
  onChange: (date: string) => void;
  minDate: string;
  className?: string;
}

export default function DatePicker({ value, onChange, minDate, className = '' }: DatePickerProps) {
  const minDateObj = new Date(minDate + 'T00:00:00');
  const [isOpen, setIsOpen] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(minDateObj);
  const pickerRef = useRef<HTMLDivElement>(null);

  const selectedDate = value ? new Date(value + 'T00:00:00') : null;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (pickerRef.current && !pickerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    return { daysInMonth, startingDayOfWeek, year, month };
  };

  const formatDisplayDate = (dateStr: string) => {
    if (!dateStr) return 'Select delivery date';
    const date = new Date(dateStr + 'T00:00:00');
    return date.toLocaleDateString('en-NL', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const handleDateClick = (day: number) => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const date = new Date(year, month, day);

    if (date.getDay() === 0) {
      return;
    }

    const dateStr = date.toISOString().split('T')[0];
    if (dateStr >= minDate) {
      onChange(dateStr);
      setIsOpen(false);
    }
  };

  const goToPreviousMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  };

  const goToNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };

  const { daysInMonth, startingDayOfWeek, year, month } = getDaysInMonth(currentMonth);
  const days = [];

  for (let i = 0; i < startingDayOfWeek; i++) {
    days.push(<div key={`empty-${i}`} className="h-10" />);
  }

  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(year, month, day);
    const dateStr = date.toISOString().split('T')[0];
    const isSunday = date.getDay() === 0;
    const isBeforeMin = dateStr < minDate;
    const isSelected = selectedDate && dateStr === value;
    const isDisabled = isSunday || isBeforeMin;

    days.push(
      <button
        key={day}
        type="button"
        onClick={() => handleDateClick(day)}
        disabled={isDisabled}
        className={`h-10 rounded-lg text-sm font-medium transition-all duration-200 ${
          isSelected
            ? 'bg-oak-700 text-white shadow-md'
            : isDisabled
            ? 'text-slate-300 cursor-not-allowed opacity-30 line-through'
            : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
        }`}
      >
        {day}
      </button>
    );
  }

  const handleOpenCalendar = () => {
    if (!isOpen) {
      setCurrentMonth(minDateObj);
    }
    setIsOpen(!isOpen);
  };

  return (
    <div ref={pickerRef} className="relative">
      <button
        type="button"
        onClick={handleOpenCalendar}
        className={`flex items-center justify-between ${className}`}
      >
        <span className={value ? 'text-slate-900' : 'text-slate-500'}>
          {formatDisplayDate(value)}
        </span>
        <Calendar className="w-5 h-5 text-slate-400" />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-2 bg-white border border-slate-300 rounded-lg shadow-lg z-50 p-4 w-80">
          <div className="flex items-center justify-between mb-4">
            <button
              type="button"
              onClick={goToPreviousMonth}
              className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <h3 className="font-semibold text-slate-900">
              {currentMonth.toLocaleDateString('en-NL', { month: 'long', year: 'numeric' })}
            </h3>
            <button
              type="button"
              onClick={goToNextMonth}
              className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          <div className="grid grid-cols-7 gap-1 mb-2">
            {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((day) => (
              <div key={day} className="h-8 flex items-center justify-center text-xs font-semibold text-slate-600">
                {day}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-1">
            {days}
          </div>

          <p className="text-xs text-slate-500 mt-3 text-center">
            Sundays not available for delivery
          </p>
        </div>
      )}
    </div>
  );
}
