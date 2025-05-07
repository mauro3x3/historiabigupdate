import React from 'react';

interface SkillLevelSelectorProps {
  selectedSkill: string | null;
  onSelect: (level: string) => void;
}

const skillLevels = [
  { id: 'beginner', label: 'Beginner', description: 'I am new to this topic.' },
  { id: 'intermediate', label: 'Intermediate', description: 'I know some basics.' },
  { id: 'advanced', label: 'Advanced', description: 'I am very familiar or an expert.' },
];

const SkillLevelSelector: React.FC<SkillLevelSelectorProps> = ({ selectedSkill, onSelect }) => {
  return (
    <div className="flex flex-col items-center">
      <h2 className="text-2xl font-bold mb-2 text-center">What is your familiarity level?</h2>
      <p className="mb-6 text-gray-500 text-center">This helps us tailor your learning journey.</p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full max-w-2xl">
        {skillLevels.map((level) => (
          <button
            key={level.id}
            className={`rounded-xl border-2 p-6 transition-all duration-200 flex flex-col items-center text-center shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-400 ${selectedSkill === level.id ? 'border-timelingo-purple bg-purple-50 scale-105 shadow-lg' : 'border-gray-200 hover:border-purple-300 hover:bg-purple-50/50'}`}
            onClick={() => onSelect(level.id)}
            type="button"
          >
            <span className="text-lg font-semibold mb-2">{level.label}</span>
            <span className="text-gray-500 text-sm">{level.description}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default SkillLevelSelector; 