import React, { useState } from 'react';
import axios from 'axios';
import JourneyEditor from '../components/ai-whale/JourneyEditor';
import { toast } from 'sonner';
// @ts-ignore

const AiWhale: React.FC = () => {
  const [urls, setUrls] = useState<string[]>(['']);
  const [numModules, setNumModules] = useState(10);
  const [journeyTitle, setJourneyTitle] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [journey, setJourney] = useState<string | null>(null);

  const handleUrlChange = (idx: number, value: string) => {
    const newUrls = [...urls];
    newUrls[idx] = value;
    setUrls(newUrls);
  };

  const addUrlField = () => setUrls([...urls, '']);
  const removeUrlField = (idx: number) => setUrls(urls.filter((_, i) => i !== idx));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setJourney(null);
    const filteredUrls = urls.filter(u => u.trim());
    if (filteredUrls.length === 0) {
      setError('Please provide at least one Wikipedia URL.');
      return;
    }
    setLoading(true);
    try {
      const res = await axios.post('/api/ai-whale/generate', {
        wikipediaUrls: filteredUrls,
        numModules,
        journeyTitle,
      });
      setJourney(res.data.journey);
    } catch (err: any) {
      setError(err.response?.data?.error || err.message || 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveToDatabase = (journeyData) => {
    toast.success('Learning journey saved successfully!');
    // You can add additional logic here if needed
  };

  const handleDownload = (journeyData) => {
    toast.success('Learning journey downloaded successfully!');
    // You can add additional logic here if needed
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-start py-16 bg-gradient-to-br from-blue-50 to-yellow-50">
      <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-2xl w-full border border-blue-100">
        <h1 className="text-3xl font-extrabold text-timelingo-purple mb-4 text-center">AI Whale: Wikipedia to Learning Journey</h1>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 mb-6">
          <label className="font-semibold text-lg">Paste one or more Wikipedia article URLs:</label>
          {urls.map((url, idx) => (
            <div key={idx} className="flex gap-2 mb-1">
              <input
                type="url"
                className="border rounded px-3 py-2 text-lg focus:outline-none focus:ring-2 focus:ring-blue-300 flex-1"
                placeholder="https://en.wikipedia.org/wiki/Roman_Empire"
                value={url}
                onChange={e => handleUrlChange(idx, e.target.value)}
                required={idx === 0}
              />
              {urls.length > 1 && (
                <button type="button" onClick={() => removeUrlField(idx)} className="text-red-500 font-bold px-2">✕</button>
              )}
            </div>
          ))}
          <button type="button" onClick={addUrlField} className="text-blue-600 underline text-sm w-fit mb-2">+ Add another article</button>
          <label className="font-semibold text-lg mt-2">Number of modules/lessons:</label>
          <input
            type="number"
            min={1}
            max={100}
            className="border rounded px-3 py-2 text-lg focus:outline-none focus:ring-2 focus:ring-blue-300 w-32"
            value={numModules}
            onChange={e => setNumModules(Number(e.target.value))}
          />
          <label className="font-semibold text-lg mt-2">Journey Title (optional):</label>
          <input
            type="text"
            className="border rounded px-3 py-2 text-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
            placeholder="e.g. The Complete Roman Empire"
            value={journeyTitle}
            onChange={e => setJourneyTitle(e.target.value)}
          />
          <button
            type="submit"
            className="bg-timelingo-gold hover:bg-yellow-400 text-timelingo-navy font-bold px-6 py-2 rounded-full shadow-lg text-lg disabled:opacity-60 mt-2"
            disabled={loading || urls.filter(u => u.trim()).length === 0}
          >
            {loading ? 'Generating...' : 'Generate Learning Journey'}
          </button>
        </form>
        {error && <div className="text-red-500 text-center mb-4">{error}</div>}
        {journey && (
          <JourneyEditor
            initialJourney={journey}
            onSave={handleSaveToDatabase}
            onDownload={handleDownload}
          />
        )}
      </div>
    </div>
  );
};

export default AiWhale; 