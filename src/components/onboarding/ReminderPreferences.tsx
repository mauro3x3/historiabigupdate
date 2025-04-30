
import React, { useState } from 'react';
import { ReminderMethod } from '@/types';
import { Button } from '@/components/ui/button';
import { TimePicker } from '@/components/TimePicker';

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

const ReminderPreferences = ({ 
  selectedMethod, 
  selectedTime, 
  onMethodSelect, 
  onTimeSelect 
}: ReminderPreferencesProps) => {
  const [hasSetReminder, setHasSetReminder] = useState(false);
  
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
            className={`reminder-option relative ${selectedMethod === option.id ? 'selected' : ''}`}
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
      
      {selectedMethod && selectedMethod !== 'none' && (
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="font-semibold text-timelingo-navy mb-3">What time works best for you?</h3>
          
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <div className="flex-1">
              <TimePicker 
                value={selectedTime || '08:00'} 
                onChange={handleSaveTime}
              />
            </div>
            
            {hasSetReminder && (
              <div className="bg-green-50 text-green-700 px-3 py-1 rounded flex items-center gap-2">
                <span className="text-lg">✓</span>
                <span>Time set!</span>
              </div>
            )}
          </div>
          
          <p className="text-xs text-gray-500 mt-2">
            We'll send you a reminder at this time every day
          </p>
        </div>
      )}
    </div>
  );
};

export default ReminderPreferences;
