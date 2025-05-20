import React from 'react';

interface EraLabelProps {
  era: string;
}

const eraLabels: Record<string, string> = {
  'ancient-egypt': 'Ancient Egypt',
  'ancient-greece': 'Ancient Greece',
  'ancient-rome': 'Ancient Rome',
  'medieval': 'Medieval',
  'revolutions': 'Revolutions',
  'modern': 'Modern',
  'china': 'Chinese History',
  'islamic': 'Islamic History',
  'russian': 'Russian History',
  'jewish': 'Jewish History',
  'christian': 'Christian History'
};

const EraLabel: React.FC<EraLabelProps> = ({ era }) => {
  return <span>{eraLabels[era] || era}</span>;
};

export default EraLabel;
