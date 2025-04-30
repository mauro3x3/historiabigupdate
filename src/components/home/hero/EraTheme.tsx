import { HistoryEra } from '@/types';

export interface EraThemeProps {
  gradient: string;
  bgGradient: string;
  accent: string;
  icon: string;
  bgPattern: string;
  name: string;
}

export const getEraTheme = (preferredEra: string | null): EraThemeProps => {
  switch (preferredEra) {
    case 'jewish':
      return {
        gradient: 'from-blue-600 to-blue-800',
        bgGradient: 'from-blue-50 to-indigo-100',
        accent: 'blue',
        icon: '✡️',
        bgPattern: 'bg-[url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath d=\'M30 0l30 30-30 30L0 30 30 0zm0 10L10 30l20 20 20-20-20-20z\' fill=\'%233B82F6\' fill-opacity=\'0.1\' fill-rule=\'evenodd\'/%3E%3C/svg%3E")]',
        name: 'Jewish History'
      };
    case 'islamic':
      return {
        gradient: 'from-green-600 to-teal-800',
        bgGradient: 'from-green-50 to-emerald-100',
        accent: 'emerald',
        icon: '☪️',
        bgPattern: 'bg-[url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath d=\'M30 0C13.4 0 0 13.4 0 30s13.4 30 30 30 30-13.4 30-30S46.6 0 30 0zm0 45c-8.3 0-15-6.7-15-15s6.7-15 15-15 15 6.7 15 15-6.7 15-15 15z\' fill=\'%2310B981\' fill-opacity=\'0.1\' fill-rule=\'evenodd\'/%3E%3C/svg%3E")]',
        name: 'Islamic History'
      };
    case 'ancient-egypt':
      return {
        gradient: 'from-amber-500 to-yellow-600',
        bgGradient: 'from-amber-50 to-yellow-100', 
        accent: 'amber',
        icon: '🏺',
        bgPattern: 'bg-[url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath d=\'M0 0h20v20H0V0zm10 17L5 7h10l-5 10zm30 0l-5-10h10l-5 10z\' fill=\'%23FBBF24\' fill-opacity=\'0.1\' fill-rule=\'evenodd\'/%3E%3C/svg%3E")]',
        name: 'Ancient Egypt'
      };
    case 'rome-greece':
      return {
        gradient: 'from-cyan-600 to-blue-500',
        bgGradient: 'from-cyan-50 to-blue-100',
        accent: 'cyan',
        icon: '🏛️',
        bgPattern: 'bg-[url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath d=\'M30 30h30v30H30V30zm0-30h30v30H30V0zM0 30h30v30H0V30zM0 0h30v30H0V0z\' fill=\'%230EA5E9\' fill-opacity=\'0.1\' fill-rule=\'evenodd\'/%3E%3C/svg%3E")]',
        name: 'Rome & Greece'
      };
    case 'medieval':
      return {
        gradient: 'from-stone-600 to-stone-800',
        bgGradient: 'from-stone-50 to-stone-100',
        accent: 'stone',
        icon: '🏰',
        bgPattern: 'bg-[url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath d=\'M15 15h30v30H15V15zm30 0h15v15H45V15zm0 30h15v15H45V45zM0 0h15v15H0zm0 45h15v15H0V45z\' fill=\'%2378716C\' fill-opacity=\'0.1\' fill-rule=\'evenodd\'/%3E%3C/svg%3E")]',
        name: 'Medieval'
      };
    case 'christian':
      return {
        gradient: 'from-purple-600 to-indigo-800',
        bgGradient: 'from-purple-50 to-indigo-100',
        accent: 'purple',
        icon: '✝️',
        bgPattern: 'bg-[url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath d=\'M25 0v25H0v10h25v25h10V35h25V25H35V0H25z\' fill=\'%238B5CF6\' fill-opacity=\'0.1\' fill-rule=\'evenodd\'/%3E%3C/svg%3E")]',
        name: 'Christian History'
      };
    case 'china':
      return {
        gradient: 'from-red-600 to-red-800',
        bgGradient: 'from-red-50 to-red-100',
        accent: 'red',
        icon: '🐲',
        bgPattern: 'bg-[url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath d=\'M30 0C13.4 0 0 13.4 0 30s13.4 30 30 30 30-13.4 30-30S46.6 0 30 0zm0 45c-8.3 0-15-6.7-15-15s6.7-15 15-15 15 6.7 15 15-6.7 15-15 15z\' fill=\'%23EF4444\' fill-opacity=\'0.1\' fill-rule=\'evenodd\'/%3E%3C/svg%3E")]',
        name: 'Chinese History'
      };
    case 'russian':
      return {
        gradient: 'from-red-600 to-blue-700',
        bgGradient: 'from-red-50 to-blue-100',
        accent: 'blue',
        icon: '🇷🇺',
        bgPattern: 'bg-[url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath d=\'M15 0v15h15V0H15zm30 0v15h15V0H45zM0 15v15h15V15H0zm45 0v15h15V15H45zM15 30v15h15V30H15zm30 0v15h15V30H45zM0 45v15h15V45H0zm15 0v15h15V45H15zm30 0v15h15V45H45z\' fill=\'%232563EB\' fill-opacity=\'0.1\' fill-rule=\'evenodd\'/%3E%3C/svg%3E")]',
        name: 'Russian History'
      };
    default:
      return {
        gradient: 'from-purple-600 to-purple-800',
        bgGradient: 'from-purple-50 to-purple-100',
        accent: 'purple',
        icon: '📚',
        bgPattern: '',
        name: 'History'
      };
  }
};
