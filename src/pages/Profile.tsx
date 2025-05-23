import React, { useState } from 'react';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import UserStats from '@/components/dashboard/UserStats';
import { useDashboardData } from '@/hooks/useDashboardData';

const HISTORY_FACTS = [
  "The shortest war in history was between Britain and Zanzibar on August 27, 1896. Zanzibar surrendered after 38 minutes!",
  "Cleopatra lived closer in time to the moon landing than to the construction of the Great Pyramid of Giza.",
  "Oxford University is older than the Aztec Empire.",
  "The Great Fire of London in 1666 destroyed most of the city, but only six people were recorded to have died.",
  "Vikings used the bones of slain animals as combs.",
  "In Ancient Egypt, servants were smeared with honey to attract flies away from the pharaoh.",
  "The first ever Olympic Games took place in 776 BC in Olympia, Greece.",
  "The world's oldest known \"toilet\" is over 4,000 years old and was found in Scotland.",
];

const AVATAR_IMAGES = [
  '/images/avatars/goldfish_3.png',
  '/images/avatars/goldfish_4.png',
  '/images/avatars/goldfish_5.png',
  '/images/avatars/goldfish_8.png',
  '/images/avatars/goldfish_15.png',
  '/images/avatars/goldfish_29.png',
  '/images/avatars/goldfish_38.png',
  '/images/avatars/goldfish_52.png',
  '/images/avatars/goldfish_84.png',
  '/images/avatars/Johan.png',
];

const Profile = () => {
  const {
    currentEra,
    isLoading,
    learningTrack
  } = useDashboardData();
  const [factIdx] = useState(() => Math.floor(Math.random() * HISTORY_FACTS.length));
  const [avatarIdx] = useState(() => Math.floor(Math.random() * AVATAR_IMAGES.length));

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <div className="bg-white rounded-3xl shadow-2xl px-10 py-12 flex flex-col items-center gap-6 border-2 border-purple-100 animate-fade-in">
          <img src={AVATAR_IMAGES[avatarIdx]} alt="Loading mascot" className="w-28 h-28 object-contain drop-shadow mb-2 animate-bounce-slow" />
          <div className="text-lg text-timelingo-purple font-semibold text-center max-w-md">{HISTORY_FACTS[factIdx]}</div>
          <div className="flex flex-col items-center mt-2">
            <div className="w-12 h-12 border-4 border-t-timelingo-purple border-b-timelingo-purple rounded-full animate-spin mb-2"></div>
            <div className="text-gray-600 text-base font-medium">Loading your learning journey...</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader />
      <div className="flex flex-col items-center">
        <UserStats learningTrack={learningTrack} />
      </div>
    </div>
  );
};

export default Profile; 