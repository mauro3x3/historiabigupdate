import React, { useState } from 'react';

const QuizEditModal = ({ quiz, onClose, onSave }) => {
  const [name, setName] = useState(quiz.name || '');
  const [theme, setTheme] = useState(quiz.theme || '');
  const [imageUrl, setImageUrl] = useState(quiz.image_url || '');
  const [questions, setQuestions] = useState(quiz.questions || []);
  const [expandedIdx, setExpandedIdx] = useState(0);

  const handleQuestionChange = (idx, field, value) => {
    setQuestions(qs => qs.map((q, i) => i === idx ? { ...q, [field]: value } : q));
  };
  const handleOptionChange = (qIdx, optIdx, value) => {
    setQuestions(qs => qs.map((q, i) => i === qIdx ? { ...q, options: q.options.map((o, oi) => oi === optIdx ? value : o) } : q));
  };
  const handleCorrectChange = (qIdx, value) => {
    setQuestions(qs => qs.map((q, i) => i === qIdx ? { ...q, correctAnswer: value } : q));
  };
  const handleAddQuestion = () => {
    setQuestions(qs => [...qs, { question: '', options: ['', '', '', ''], correctAnswer: 0 }]);
    setExpandedIdx(questions.length); // Expand the new question
  };
  const handleRemoveQuestion = (idx) => {
    setQuestions(qs => qs.filter((_, i) => i !== idx));
    if (expandedIdx === idx) setExpandedIdx(-1);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-3xl relative flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="sticky top-0 bg-white z-10 rounded-t-2xl border-b px-8 pt-8 pb-4 flex items-center justify-between">
          <h2 className="text-2xl font-bold">Edit Quiz</h2>
          <button className="text-gray-500 hover:text-red-500 text-2xl font-bold" onClick={onClose}>✕</button>
        </div>
        {/* Scrollable Body */}
        <div className="overflow-y-auto px-8 py-4 flex-1">
          <div className="mb-6">
            <label className="block font-semibold mb-1">Quiz Name</label>
            <input className="border rounded px-3 py-2 w-full focus:ring-2 focus:ring-timelingo-gold transition" value={name} onChange={e => setName(e.target.value)} />
          </div>
          <div className="mb-6">
            <label className="block font-semibold mb-1">Theme</label>
            <input className="border rounded px-3 py-2 w-full focus:ring-2 focus:ring-timelingo-gold transition" value={theme} onChange={e => setTheme(e.target.value)} />
          </div>
          <div className="mb-8">
            <label className="block font-semibold mb-1">Image URL</label>
            <input className="border rounded px-3 py-2 w-full focus:ring-2 focus:ring-timelingo-gold transition" value={imageUrl} onChange={e => setImageUrl(e.target.value)} />
            {imageUrl && <img src={imageUrl} alt="Quiz" className="mt-2 max-h-32 rounded shadow border" style={{objectFit:'contain'}} />}
          </div>
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <label className="block text-lg font-bold">Questions</label>
              <button className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-xl text-sm shadow transition" onClick={handleAddQuestion}>Add Question</button>
            </div>
            <div className="space-y-3">
              {questions.map((q, idx) => (
                <div key={idx} className={`rounded-xl border ${expandedIdx === idx ? 'border-timelingo-gold bg-yellow-50' : 'border-gray-200 bg-gray-50'} shadow-sm transition-all`}> 
                  <button
                    className={`w-full flex justify-between items-center px-4 py-3 text-left font-semibold text-timelingo-navy focus:outline-none focus:ring-2 focus:ring-timelingo-gold rounded-t-xl ${expandedIdx === idx ? 'bg-yellow-100' : ''}`}
                    onClick={() => setExpandedIdx(expandedIdx === idx ? -1 : idx)}
                  >
                    <span>Q{idx + 1}: {q.question ? q.question.slice(0, 40) + (q.question.length > 40 ? '...' : '') : <span className="italic text-gray-400">(No question text)</span>}</span>
                    <span className="ml-2 text-xs text-gray-400">{expandedIdx === idx ? '▲' : '▼'}</span>
                  </button>
                  {expandedIdx === idx && (
                    <div className="p-4 pt-2">
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-semibold">Edit Question</span>
                        <button className="text-red-500 text-xs hover:underline" onClick={() => handleRemoveQuestion(idx)}>Remove</button>
                      </div>
                      <input className="border rounded px-2 py-1 w-full mb-2 focus:ring-2 focus:ring-timelingo-gold transition" value={q.question} onChange={e => handleQuestionChange(idx, 'question', e.target.value)} placeholder="Question text" />
                      <div className="grid grid-cols-2 gap-2 mb-2">
                        {q.options.map((opt, optIdx) => (
                          <input
                            key={optIdx}
                            className="border rounded px-2 py-1 focus:ring-2 focus:ring-timelingo-gold transition"
                            value={opt}
                            onChange={e => handleOptionChange(idx, optIdx, e.target.value)}
                            placeholder={`Option ${String.fromCharCode(65 + optIdx)}`}
                          />
                        ))}
                      </div>
                      <div className="mb-2">
                        <label className="block font-semibold mb-1">Correct Answer</label>
                        <select className="border rounded px-2 py-1 focus:ring-2 focus:ring-timelingo-gold transition" value={q.correctAnswer} onChange={e => handleCorrectChange(idx, Number(e.target.value))}>
                          {q.options.map((opt, optIdx) => (
                            <option key={optIdx} value={optIdx}>{opt ? opt : `Option ${String.fromCharCode(65 + optIdx)}`}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
        {/* Sticky Save/Cancel Bar */}
        <div className="sticky bottom-0 bg-white z-10 rounded-b-2xl border-t px-8 py-4 flex justify-end gap-2 shadow-inner">
          <button className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded-xl transition" onClick={onClose}>Cancel</button>
          <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-xl transition" onClick={() => onSave({ ...quiz, name, theme, image_url: imageUrl, questions })}>Save</button>
        </div>
      </div>
    </div>
  );
};

export default QuizEditModal; 