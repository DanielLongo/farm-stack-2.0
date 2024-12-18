import React, { FC, useState } from "react";
import { FiArrowRight } from "react-icons/fi";

const DatasetsView: FC = () => {
  const [query, setQuery] = useState("");

  const handleSearch = () => {
    // Implement your search functionality here
    console.log("Search query:", query);
  };

  return (
    <div className="flex flex-col items-center justify-start min-h-screen bg-gray-100 p-4 pt-20">
      <h1 className="mb-6 text-2xl font-semibold text-center text-gray-800">
        Search Your Sources
      </h1>
      <div className="relative w-full max-w-md">
        <textarea
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Type your question here..."
          className="w-full h-24 p-4 pr-10 text-black border border-gray-400 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={handleSearch}
          disabled={query.trim() === ""}
          className={`absolute bottom-2 right-2 flex items-center justify-center w-8 h-8 rounded-full transition-colors duration-300 ${
            query.trim() !== ""
              ? "bg-blue-600 text-white hover:bg-blue-700 focus:ring-2 focus:ring-blue-500"
              : "bg-transparent text-gray-400 cursor-not-allowed"
          }`}
          aria-label="Submit Search"
        >
          <FiArrowRight size={16} />
        </button>
      </div>
    </div>
  );
};

export default DatasetsView;
