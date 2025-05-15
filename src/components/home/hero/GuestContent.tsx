import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useLearningJourneys } from '@/hooks/useLearningJourneys';
import { dbService } from '@/services/dbService';
import { QuizQuestion } from '@/types';
import ReadAloudButton from '@/components/ReadAloudButton';

const encouragements = [
  'Great job! 🎉',
  "You're on a roll! 🥳",
  'History hero! 🏆',
  'Keep going! 🚀',
  "You're making progress! ⭐",
];

const GuestContent: React.FC = () => {
  const navigate = useNavigate();
  const { journeys, isLoading } = useLearningJourneys();
  const [selectedJourney, setSelectedJourney] = useState<any | null>(null);
  const [firstModule, setFirstModule] = useState<any | null>(null);
  const [showModule, setShowModule] = useState(false);
  const [progress, setProgress] = useState(0);
  const [showSaveBanner, setShowSaveBanner] = useState(false);
  const [encouragement, setEncouragement] = useState('');
  const [mascotBounce, setMascotBounce] = useState(false);
  const [quizQuestions, setQuizQuestions] = useState<QuizQuestion[]>([]);
  const [quizAnswers, setQuizAnswers] = useState<number[]>([]);
  const [quizFeedback, setQuizFeedback] = useState<(boolean | null)[]>([]);
  const [quizComplete, setQuizComplete] = useState(false);

  // Play sound utility
  const playSound = (src: string) => {
    const audio = new Audio(src);
    audio.play();
  };

  // Mascot click handler
  const handleMascotClick = () => {
    setMascotBounce(true);
    playSound('/sounds/water.mp3');
    setTimeout(() => setMascotBounce(false), 1000);
  };

  // Start learning journey
  const handleStartLearning = () => {
    setShowModule(true);
    setProgress(0);
  };

  // Simulate module completion
  const handleCompleteModule = () => {
    setProgress(1);
    setShowSaveBanner(true);
    setEncouragement(encouragements[Math.floor(Math.random() * encouragements.length)]);
    playSound('/sounds/correct-answer.mp3');
    setMascotBounce(true);
    setTimeout(() => setMascotBounce(false), 1200);
  };

  // Sign up handler
  const handleSignIn = () => {
    navigate('/auth');
  };

  // Only show the Jewish journey for guests and fetch its first module and quiz
  useEffect(() => {
    if (journeys && journeys.length > 0) {
      const jewishJourney = journeys.find(j =>
        (j.title && j.title.toLowerCase().includes('jewish')) ||
        (j.era && j.era.toLowerCase().includes('jewish'))
      );
      if (jewishJourney) {
        setSelectedJourney(jewishJourney);
        dbService.modules.getByJourneyId(jewishJourney.id).then(async ({ data }) => {
          if (data && data.length > 0) {
            setFirstModule(data[0]);
            // Fetch quiz questions for the first module
            const { data: questions } = await dbService.questions.getByModuleId(data[0].id);
            if (questions && questions.length > 0) {
              // Map to QuizQuestion type
              const mappedQuestions = questions.map((q: any) => ({
                id: q.id,
                question: q.question,
                options: q.options,
                correctAnswer: q.correct_answer,
                explanation: q.explanation,
                lesson_id: q.module_id,
              }));
              setQuizQuestions(mappedQuestions);
              setQuizAnswers(Array(mappedQuestions.length).fill(-1));
              setQuizFeedback(Array(mappedQuestions.length).fill(null));
            }
          }
        });
      }
    }
  }, [journeys]);

  // Quiz answer handler
  const handleQuizAnswer = (qIdx: number, optIdx: number) => {
    if (quizFeedback[qIdx] !== null) return; // Don't allow changing after answer
    const isCorrect = quizQuestions[qIdx].correctAnswer === optIdx;
    const newAnswers = [...quizAnswers];
    newAnswers[qIdx] = optIdx;
    setQuizAnswers(newAnswers);
    const newFeedback = [...quizFeedback];
    newFeedback[qIdx] = isCorrect;
    setQuizFeedback(newFeedback);
    if (isCorrect) playSound('/sounds/correct-answer.mp3');
    else playSound('/sounds/wrong-answer.mp3');
    // If all questions answered, mark quiz complete
    if (newFeedback.every(fb => fb !== null)) {
      setQuizComplete(true);
    }
  };

  return (
    <div className="min-h-[100vh] w-full flex flex-col items-center justify-center bg-gradient-to-br from-purple-100 via-blue-50 to-yellow-50 relative overflow-x-hidden">
      {/* Sticky Save Progress Banner */}
      {showSaveBanner && (
        <div className="fixed top-0 left-0 w-full z-50 flex justify-center animate-fade-in">
          <div className="bg-gradient-to-r from-timelingo-purple to-purple-700 text-white px-6 py-4 rounded-b-2xl shadow-lg flex items-center gap-4 mt-0">
            <span className="text-xl font-bold">🎉 Sign up to unlock the full journey!</span>
            <span className="hidden sm:inline">Create a free account to continue learning and save your progress.</span>
            <Button onClick={handleSignIn} className="ml-4 bg-yellow-400 hover:bg-yellow-500 text-timelingo-navy font-bold px-6 py-2 rounded-full shadow-lg animate-pulse">Sign Up</Button>
          </div>
        </div>
      )}
      {/* Mascot at the top */}
      <div className={`flex flex-col items-center mt-8 mb-2 ${mascotBounce ? 'animate-bounce' : 'animate-bounce-slow'}`}> 
        <img 
          src="/images/avatars/goldfish_3.png" 
          alt="Mascot" 
          className="w-28 h-28 object-contain drop-shadow-lg cursor-pointer hover:scale-110 transition-transform" 
          onClick={handleMascotClick}
          title="Click me for encouragement!"
        />
        <div className="bg-white rounded-xl shadow px-4 py-2 text-timelingo-purple text-md font-medium max-w-xs mt-2 border-2 border-timelingo-purple animate-fade-in text-center">
          {encouragement || 'Welcome! Click the mascot for encouragement.'}
        </div>
      </div>
      {/* Main Card Container */}
      <div className="w-full max-w-2xl bg-white/90 rounded-3xl shadow-2xl px-8 py-10 flex flex-col items-center gap-8 mt-4 mb-8 border-2 border-purple-100">
        {/* Hero Section */}
        <div className="flex flex-col items-center gap-2">
          <div className="text-4xl mb-1">🏛️</div>
          <h3 className="text-3xl md:text-4xl font-extrabold text-timelingo-purple mb-1 text-center">Welcome to Historia!</h3>
          <p className="text-lg text-gray-600 mb-3 text-center max-w-xl">The fun, interactive way to learn history and track your progress.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-2 w-full">
            <Button
              onClick={handleSignIn}
              className="bg-gradient-to-r from-timelingo-purple to-purple-700 hover:opacity-90 px-10 py-4 text-lg font-bold rounded-full shadow-lg animate-pulse hover:scale-105 transition-transform"
              style={{ minWidth: 200 }}
            >
              Sign In to Start Learning
            </Button>
            <Button
              variant="secondary"
              onClick={handleStartLearning}
              className="px-10 py-4 text-lg font-bold border-2 border-timelingo-purple bg-white text-timelingo-purple hover:bg-purple-50 rounded-full shadow-lg hover:scale-105 transition-transform"
              style={{ minWidth: 200 }}
              disabled={!selectedJourney || !firstModule}
            >
              Try the First Jewish Module
            </Button>
          </div>
        </div>
        {/* Learning Journey Preview */}
        {isLoading && <div className="text-center text-gray-500">Loading journeys...</div>}
        {!isLoading && selectedJourney && firstModule && !showModule && (
          <div className="w-full flex flex-col items-center gap-4">
            <div className="text-2xl font-bold text-timelingo-navy mb-1">{selectedJourney.title}</div>
            <div className="text-gray-600 text-center mb-2">{selectedJourney.description}</div>
            <div className="flex flex-wrap gap-2 justify-center mb-2">
              {selectedJourney.level_names.map((level: string, idx: number) => (
                <span key={idx} className="bg-purple-100 text-timelingo-purple px-3 py-1 rounded-full text-xs font-semibold">{level}</span>
              ))}
            </div>
            <div className="text-sm text-gray-500 mb-2">{selectedJourney.modules_count} modules</div>
            <div className="text-xs text-timelingo-purple font-semibold mb-2">Free Preview: First Module Only</div>
            <div className="w-full bg-purple-50 rounded-xl shadow p-4 mb-2">
              <div className="text-lg font-bold text-timelingo-navy mb-1">{firstModule.title}</div>
              <div className="text-gray-700" dangerouslySetInnerHTML={{ __html: firstModule.description || '' }} />
              <ReadAloudButton text={firstModule.story_content || firstModule.description || firstModule.title} />
            </div>
            <Button onClick={handleStartLearning} className="bg-timelingo-gold hover:bg-yellow-400 text-timelingo-navy font-bold px-6 py-2 rounded-full shadow-lg animate-pulse">Start Free Preview</Button>
          </div>
        )}
        {/* Module Demo - Interactive */}
        {showModule && selectedJourney && firstModule && (
          <div className="w-full flex flex-col items-center gap-4">
            {/* Images */}
            {firstModule.image_urls && firstModule.image_urls.split(',').filter((url: string) => url.trim()).length > 0 && (
              <div className="flex flex-wrap gap-4 justify-center mb-4">
                {firstModule.image_urls.split(',').map((url: string, idx: number) => (
                  <img key={idx} src={url.trim()} alt="Module visual" className="w-40 h-40 object-cover rounded-xl border shadow" />
                ))}
              </div>
            )}
            {/* Story */}
            <div className="text-xl font-bold text-timelingo-navy mb-1">{firstModule.title}</div>
            <div className="text-gray-600 text-center mb-2" dangerouslySetInnerHTML={{ __html: firstModule.description || '' }} />
            <div className="bg-gradient-to-br from-yellow-50 to-purple-50 rounded-xl shadow p-6 w-full text-center mb-2">
              {firstModule.story_content && <div className="text-lg font-semibold mb-6" dangerouslySetInnerHTML={{ __html: firstModule.story_content }} />}
              <ReadAloudButton text={firstModule.story_content || firstModule.description || firstModule.title} />
              {/* Quiz Section */}
              {quizQuestions.length > 0 && (
                <div className="w-full flex flex-col gap-6 items-center">
                  <div className="text-lg font-bold text-timelingo-purple mb-2">Quiz Time!</div>
                  {quizQuestions.map((q, qIdx) => (
                    <div key={q.id} className="w-full bg-white rounded-xl shadow p-4 mb-2 border-2 border-purple-100">
                      <div className="font-semibold mb-2 text-timelingo-navy">Q{qIdx + 1}: {q.question}</div>
                      <div className="flex flex-col gap-2">
                        {q.options.map((opt, optIdx) => (
                          <button
                            key={optIdx}
                            className={`w-full text-left px-4 py-2 rounded-lg border-2 transition-all font-medium ${quizAnswers[qIdx] === optIdx ? (quizFeedback[qIdx] === true ? 'bg-green-100 border-green-400' : quizFeedback[qIdx] === false ? 'bg-red-100 border-red-400' : 'bg-purple-50 border-purple-200') : 'bg-purple-50 border-purple-200 hover:bg-purple-100'} ${quizFeedback[qIdx] !== null ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                            disabled={quizFeedback[qIdx] !== null}
                            onClick={() => handleQuizAnswer(qIdx, optIdx)}
                          >
                            <span className="mr-2 font-bold">{String.fromCharCode(65 + optIdx)}.</span> {opt}
                          </button>
                        ))}
                      </div>
                      {quizFeedback[qIdx] !== null && (
                        <div className={`mt-2 text-sm font-bold ${quizFeedback[qIdx] ? 'text-green-600' : 'text-red-600'}`}>{quizFeedback[qIdx] ? 'Correct!' : 'Incorrect.'} {quizFeedback[qIdx] === false && q.explanation ? <span className="block text-gray-500 font-normal mt-1">{q.explanation}</span> : null}</div>
                      )}
                    </div>
                  ))}
                </div>
              )}
              {/* Completion Section */}
              {quizQuestions.length > 0 && quizComplete && progress === 0 && (
                <Button onClick={handleCompleteModule} className="bg-timelingo-purple hover:bg-purple-700 text-white font-bold px-6 py-2 rounded-full shadow-lg mt-6">Mark as Complete</Button>
              )}
              {progress > 0 && <div className="text-green-600 font-bold">Module complete! 🎉<br/>Sign up to unlock the full journey.</div>}
            </div>
          </div>
        )}
      </div>
      <style>{`
        @keyframes bounce { 0%{transform:translateY(0);} 50%{transform:translateY(-30px);} 100%{transform:translateY(0);} }
        .animate-fade-in { animation: fadeIn 0.7s; }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        .animate-bounce-slow { animation: bounce 2.5s infinite; }
        .animate-bounce { animation: bounce 0.5s 2; }
      `}</style>
    </div>
  );
};

export default GuestContent;
