
import React from 'react';
import { Specialty } from '../types';

interface SpecialtySelectorProps {
  specialties: { id: Specialty; name: string }[];
  selectedSpecialty: Specialty;
  onSelect: (specialty: Specialty) => void;
}

const SpecialtySelector: React.FC<SpecialtySelectorProps> = ({ specialties, selectedSpecialty, onSelect }) => {
  return (
    <div className="p-4 bg-white dark:bg-gray-800 rounded-t-lg border-b border-gray-200 dark:border-gray-700">
      <h2 className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-3 text-center sm:text-left">
        Select Your Field of Study
      </h2>
      <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
        {specialties.map((spec) => (
          <button
            key={spec.id}
            onClick={() => onSelect(spec.id)}
            className={`px-4 py-2 text-sm font-medium rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 dark:focus:ring-offset-gray-800
              ${selectedSpecialty === spec.id
                ? 'bg-primary-600 text-white shadow'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600'
              }`}
          >
            {spec.name}
          </button>
        ))}
      </div>
    </div>
  );
};

export default SpecialtySelector;