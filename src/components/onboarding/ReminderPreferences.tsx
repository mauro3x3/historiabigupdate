import React, { useState } from 'react';
import { ReminderMethod } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface ReminderPreferencesProps {
  selectedMethod: ReminderMethod | null;
  selectedTime: string | null;
  onMethodSelect: (method: ReminderMethod) => void;
  onTimeSelect: (time: string) => void;
}

const reminderOptions = [
  {
    id: 'push' as ReminderMethod,
    title: 'Push Notifications',
    description: 'Get notifications directly on your device',
    icon: '🔔',
  },
  {
    id: 'email' as ReminderMethod,
    title: 'Email Reminders',
    description: 'Receive daily emails to continue learning',
    icon: '📧',
  },
  {
    id: 'none' as ReminderMethod,
    title: 'No Reminders',
    description: 'I\'ll remember to study on my own',
    icon: '🙅‍♂️',
  },
];

const commonTimes = [
  '07:00', '08:00', '09:00', '12:00', '15:00', '18:00', '19:00', '21:00', '22:00'
];

function isValidTime(time: string) {
  // Accepts 24-hour (e.g. 21:30) or 12-hour (e.g. 9:30 PM)
  return /^([01]?\d|2[0-3]):[0-5]\d$/.test(time) ||
    /^([1-9]|1[0-2]):[0-5]\d ?([AaPp][Mm])$/.test(time) ||
    /^([1-9]|1[0-2]) ?([AaPp][Mm])$/.test(time);
}

const ReminderPreferences = ({ 
  selectedMethod, 
  selectedTime, 
  onMethodSelect, 
  onTimeSelect 
}: ReminderPreferencesProps) => {
  const [hasSetReminder, setHasSetReminder] = useState(false);
  
  // Smart default: 19:00 (7:00 PM) local time
  const getDefaultTime = () => {
    if (selectedTime) return selectedTime;
    const now = new Date();
    now.setHours(19, 0, 0, 0);
    return now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
  };

  const handleSaveTime = (time: string) => {
    onTimeSelect(time);
    setHasSetReminder(true);
  };
  
  return (
    <div className="space-y-6 animate-fade-in">
      <h2 className="text-2xl font-bold text-center text-timelingo-navy">
        Want reminders to stay on track?
      </h2>
      <p className="text-center text-gray-500 mb-4">Choose how you'd like to be reminded about your daily learning</p>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {reminderOptions.map((option) => (
          <div 
            key={option.id}
            className={`reminder-option relative rounded-xl border-2 p-6 cursor-pointer transition-all duration-200 flex flex-col items-center text-center shadow-sm ${selectedMethod === option.id ? 'border-timelingo-purple bg-purple-50 scale-105 shadow-lg' : 'border-gray-200 hover:border-purple-300 hover:bg-purple-50/50'}`}
            onClick={() => onMethodSelect(option.id)}
          >
            <div className="text-3xl mb-2">{option.icon}</div>
            <h3 className="font-semibold text-timelingo-navy">{option.title}</h3>
            <p className="text-sm text-gray-500">{option.description}</p>
            {selectedMethod === option.id && (
              <div className="absolute -top-2 -right-2 w-6 h-6 bg-timelingo-purple text-white rounded-full flex items-center justify-center shadow-md">
                ✓
              </div>
            )}
          </div>
        ))}
      </div>
      
      {selectedMethod === 'none' && (
        <div className="bg-blue-50 p-4 rounded-lg text-blue-700 text-center">
          You're in control! We'll trust you to come back on your own. 🚀
        </div>
      )}
      
      {selectedMethod && selectedMethod !== 'none' && (
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="font-semibold text-timelingo-navy mb-3">What time works best for you?</h3>
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <div className="flex-1 flex flex-col gap-2">
              <Input
                type="text"
                placeholder="e.g. 21:30 or 9:30 PM"
                value={selectedTime || ''}
                onChange={e => handleSaveTime(e.target.value)}
                className="mb-2"
              />
              <div className="flex flex-wrap gap-2">
                {commonTimes.map((t) => (
                  <Button
                    key={t}
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => handleSaveTime(t)}
                    className={selectedTime === t ? 'bg-purple-100 border-purple-400' : ''}
                  >
                    {t}
                  </Button>
                ))}
              </div>
              <span className="text-xs text-gray-500 mt-1">You can enter time in 24-hour or 12-hour format, or pick from the dropdown.</span>
              {!isValidTime(selectedTime || '') && selectedTime && (
                <span className="text-xs text-red-500">Please enter a valid time (e.g. 21:30 or 9:30 PM)</span>
              )}
            </div>
            {hasSetReminder && (
              <div className="bg-green-50 text-green-700 px-3 py-1 rounded flex items-center gap-2">
                <span className="text-lg">✓</span>
                <span>Time set!</span>
              </div>
            )}
          </div>
          <p className="text-xs text-gray-500 mt-2">
            We'll send you a gentle nudge at this time every day.
          </p>
          {selectedTime && isValidTime(selectedTime) && (
            <div className="mt-2 text-green-700 text-sm font-medium text-center">
              You'll get a reminder every day at {selectedTime}.
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ReminderPreferences;
