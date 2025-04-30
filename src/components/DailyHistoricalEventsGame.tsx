import React, { useState } from 'react';
import { GripVertical, CheckCircle, XCircle, Share2 } from 'lucide-react';

// Example pool of events (replace with real data or API later)
const EVENTS_POOL = [
  [
    { id: 1, text: 'Fall of the Berlin Wall', year: 1989 },
    { id: 2, text: 'Signing of the Magna Carta', year: 1215 },
    { id: 3, text: 'Moon Landing', year: 1969 },
    { id: 4, text: 'Start of World War I', year: 1914 },
  ],
  [
    { id: 1, text: 'Discovery of America by Columbus', year: 1492 },
    { id: 2, text: 'French Revolution begins', year: 1789 },
    { id: 3, text: 'Printing Press Invented', year: 1440 },
    { id: 4, text: 'Martin Luther\'s 95 Theses', year: 1517 },
  ],
  // Add more sets for more days
];

function getTodayIndex() {
  // Simple daily rotation
  const start = new Date(2024, 0, 1);
  const today = new Date();
  const diff = Math.floor((Number(today) - Number(start)) / (1000 * 60 * 60 * 24));
  return diff % EVENTS_POOL.length;
}

function shuffle(arr) {
  // Fisher-Yates shuffle
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

interface DailyHistoricalEventsGameProps {
  onComplete?: () => void;
}

const DailyHistoricalEventsGame: React.FC<DailyHistoricalEventsGameProps> = ({ onComplete }) => {
  const [events, setEvents] = useState(() => shuffle(EVENTS_POOL[getTodayIndex()]));
  const [submitted, setSubmitted] = useState(false);
  const [result, setResult] = useState(null);
  const [shareText, setShareText] = useState('');

  // Drag and drop logic
  const onDragStart = (idx) => (e) => {
    e.dataTransfer.setData('text/plain', idx);
  };
  const onDrop = (idx) => (e) => {
    const fromIdx = parseInt(e.dataTransfer.getData('text/plain'), 10);
    if (fromIdx === idx) return;
    const newEvents = [...events];
    const [moved] = newEvents.splice(fromIdx, 1);
    newEvents.splice(idx, 0, moved);
    setEvents(newEvents);
  };
  const onDragOver = (e) => e.preventDefault();

  // Submission logic
  const handleSubmit = () => {
    setSubmitted(true);
    const correct = [...events].sort((a, b) => a.year - b.year);
    const isCorrect = events.every((ev, i) => ev.id === correct[i].id);
    setResult({ isCorrect, correct });
    // Build share text (like Wordle)
    const emoji = isCorrect ? '🟩' : '🟨';
    const share = `ChronoGuessr ${new Date().toLocaleDateString()}: ${isCorrect ? 'Perfect!' : 'Try again!'}\n` +
      events.map((ev, i) => (ev.id === correct[i].id ? '🟩' : '🟨')).join('') +
      `\n${window.location.href} #HistoriaApp`;
    setShareText(share);
    if (onComplete) onComplete();
  };

  const handleShare = async () => {
    if (navigator.share) {
      await navigator.share({ text: shareText });
    } else {
      await navigator.clipboard.writeText(shareText);
      alert('Result copied! Share it with your friends!');
    }
  };

  return (
    <div className="w-full max-w-xl mx-auto p-6 bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl shadow-xl flex flex-col items-center">
      <h2 className="text-2xl font-bold mb-2 text-timelingo-navy">Daily Historical Events in Order</h2>
      <p className="text-gray-600 mb-4 text-center">Drag and drop the events to put them in the correct chronological order (earliest at the top).</p>
      <div className="w-full flex flex-col gap-3 mb-6">
        {events.map((ev, idx) => (
          <div
            key={ev.id}
            className={`flex items-center gap-3 p-4 rounded-xl bg-white shadow border border-gray-200 cursor-move transition-all ${submitted && (ev.id === result?.correct[idx]?.id ? 'bg-green-100 border-green-300' : 'bg-yellow-50 border-yellow-200')}`}
            draggable={!submitted}
            onDragStart={onDragStart(idx)}
            onDrop={onDrop(idx)}
            onDragOver={onDragOver}
            aria-label={`Event: ${ev.text}`}
          >
            <GripVertical className="text-gray-400 mr-2" />
            <span className="flex-1 text-lg font-medium">{ev.text}</span>
            {submitted && (ev.id === result?.correct[idx]?.id ? <CheckCircle className="text-green-500" /> : <XCircle className="text-yellow-500" />)}
          </div>
        ))}
      </div>
      {!submitted ? (
        <button
          className="px-6 py-2 rounded-full bg-timelingo-gold text-timelingo-navy font-bold shadow hover:bg-yellow-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 transition-colors"
          onClick={handleSubmit}
        >
          Submit
        </button>
      ) : (
        <div className="flex flex-col items-center gap-3 w-full">
          <div className="text-lg font-semibold text-timelingo-navy">
            {result.isCorrect ? "🎉 Perfect! You got them all in order!" : "Almost! Here's the correct order:"}
          </div>
          {!result.isCorrect && (
            <ol className="list-decimal pl-6 text-left w-full text-timelingo-navy">
              {result.correct.map(ev => <li key={ev.id}>{ev.text} <span className="text-xs text-gray-400">({ev.year})</span></li>)}
            </ol>
          )}
          <button
            className="flex items-center gap-2 px-5 py-2 rounded-full bg-timelingo-purple text-white font-bold shadow hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-400 transition-colors"
            onClick={handleShare}
          >
            <Share2 className="h-5 w-5" /> Share your result
          </button>
        </div>
      )}
    </div>
  );
};

export default DailyHistoricalEventsGame; 