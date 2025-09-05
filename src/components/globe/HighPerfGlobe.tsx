import React from 'react';
import MapLibreGlobe from './MapLibreGlobe';

interface Module {
  id: string;
  title: string;
  journey_id: string;
  latitude: number;
  longitude: number;
  completed: boolean;
  summary?: string;
}

interface Journey {
  id: string;
  title: string;
  modules: Module[];
}

interface HighPerfGlobeProps {
  journeys?: Journey[];
  onModuleClick?: (module: Module) => void;
}

export default function HighPerfGlobe({ journeys = [], onModuleClick }: HighPerfGlobeProps) {
  return (
    <div style={{ width: '100vw', height: '100vh', background: '#f8fafc' }}>
      <MapLibreGlobe journeys={journeys} onModuleClick={onModuleClick} />
    </div>
  );
} 