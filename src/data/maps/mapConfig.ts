import { HistoryEra } from '@/types';
import mapboxgl from 'mapbox-gl';

export type MapProjection = mapboxgl.ProjectionSpecification;

export interface MapConfig {
  initialCenter: [number, number]; // [longitude, latitude]
  initialZoom: number;
  projection: MapProjection;
  bounds?: [[number, number], [number, number]];
}

export const getEraMapConfig = (era: string): MapConfig => {
  switch (era) {
    case 'jewish':
      return {
        initialCenter: [35.0, 31.5], // Centered on Israel/Canaan
        initialZoom: 6,
        projection: { name: 'mercator' } as mapboxgl.ProjectionSpecification
      };
    case 'ancient-egypt':
      return {
        initialCenter: [31.2, 30.0], // Centered on Egypt
        initialZoom: 5,
        projection: { name: 'mercator' } as mapboxgl.ProjectionSpecification
      };
    case 'ancient-greece':
    case 'ancient-rome':
    case 'rome-greece':
      return {
        initialCenter: [12.5, 41.9], // Centered on Rome
        initialZoom: 4,
        projection: { name: 'mercator' } as mapboxgl.ProjectionSpecification
      };
    case 'medieval':
      return {
        initialCenter: [10.0, 50.0], // Centered on Europe
        initialZoom: 4,
        projection: { name: 'mercator' } as mapboxgl.ProjectionSpecification
      };
    case 'islamic':
      return {
        initialCenter: [39.0, 33.0], // Centered on Middle East
        initialZoom: 4, 
        projection: { name: 'mercator' } as mapboxgl.ProjectionSpecification
      };
    case 'christian':
      return {
        initialCenter: [21.0, 41.0], // Centered on Mediterranean
        initialZoom: 4,
        projection: { name: 'mercator' } as mapboxgl.ProjectionSpecification
      };
    default:
      return {
        initialCenter: [0.0, 30.0],
        initialZoom: 2,
        projection: { name: 'mercator' } as mapboxgl.ProjectionSpecification
      };
  }
};
