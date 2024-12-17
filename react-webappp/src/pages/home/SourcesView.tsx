import React, { FC, useState } from "react";

interface Source {
  id: number;
  name: string;
  description: string;
  lastUpdate: string;
  graphic: string;
}

const initialSources: Source[] = [
  {
    id: 1,
    name: "SEC 10K Filings",
    description:
      "Comprehensive annual reports filed by publicly traded companies.",
    lastUpdate: "2023-09-15",
    graphic: "https://via.placeholder.com/300x200.png?text=SEC+10K+Filings",
  },
  {
    id: 2,
    name: "US Census",
    description:
      "Demographic and economic data from the United States Census Bureau.",
    lastUpdate: "2023-10-01",
    graphic: "https://via.placeholder.com/300x200.png?text=US+Census",
  },
  {
    id: 3,
    name: "Weather Data",
    description: "Real-time and historical weather information.",
    lastUpdate: "2023-09-30",
    graphic: "https://via.placeholder.com/300x200.png?text=Weather+Data",
  },
  {
    id: 4,
    name: "Stock Market",
    description: "Latest stock prices and market trends.",
    lastUpdate: "2023-10-02",
    graphic: "https://via.placeholder.com/300x200.png?text=Stock+Market",
  },
];

const SourcesView: FC = () => {
  const [sources, setSources] = useState<Source[]>(initialSources);
  const [activeSources, setActiveSources] = useState<{
    [key: number]: boolean;
  }>({
    1: true,
    2: true,
    3: false,
    4: true,
  });

  const handleToggle = (id: number) => {
    setActiveSources((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Data Sources</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sources.map((source) => (
          <div
            key={source.id}
            className="relative bg-white shadow-md rounded-lg p-4 flex flex-col"
          >
            <img
              src={source.graphic}
              alt={`${source.name} graphic`}
              className="h-32 w-full object-cover rounded-md mb-4"
            />
            <h2 className="text-xl font-semibold">{source.name}</h2>
            <p className="text-gray-600 flex-grow">{source.description}</p>
            <p className="text-sm text-gray-500 mt-2">
              Last Update: {source.lastUpdate}
            </p>
            <div className="absolute top-4 right-4">
              <label className="flex items-center">
                <span className="mr-2 text-sm text-gray-700">Active</span>
                <div className="relative">
                  <input
                    type="checkbox"
                    checked={activeSources[source.id]}
                    onChange={() => handleToggle(source.id)}
                    className="sr-only peer"
                  />
                  <div
                    className="w-11 h-6 bg-gray-200 rounded-full peer peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 
                                  peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] 
                                  after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 
                                  after:border after:rounded-full after:h-5 after:w-5 after:transition-all 
                                  dark:bg-gray-700 peer-checked:bg-blue-600"
                  ></div>
                </div>
              </label>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SourcesView;
