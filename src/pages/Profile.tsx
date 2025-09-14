import React, { useState } from 'react';
import UserStats from '@/components/dashboard/UserStats';

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

const Profile = () => {
  const [factIdx] = useState(() => Math.floor(Math.random() * HISTORY_FACTS.length));

  return (
    <div className="min-h-screen bg-transparent pt-0">
      <div className="flex flex-col items-center w-full">
        <UserStats />
      </div>
    </div>
  );
};

export default Profile; 