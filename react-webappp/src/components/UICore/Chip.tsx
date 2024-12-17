import React from "react";

interface ChipProps {
  label: string;
}

const Chip: React.FC<ChipProps> = ({ label }) => {
  return (
    <span className="inline-flex items-center px-3 py-1 text-sm font-medium text-gray-800 bg-gray-200 rounded-full mr-2">
      {label}
    </span>
  );
};

export default Chip;
