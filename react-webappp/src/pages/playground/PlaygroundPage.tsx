import React, { FC, useState, useEffect } from "react";
import { FiArrowRight } from "react-icons/fi";
import Spinbox from "../../components/UICore/Spinbox";
import usePlayground from "../../hooks/usePlayground";
import AppBar from "../../components/layout/AppBar";
import Chip from "../../components/UICore/Chip";
import { useLocation } from "react-router-dom";

const loadingMessages = [
  "Researching from sources",
  "Grabbing info from the web",
  "Collating information",
  "Comparing statistics",
];

const PlaygroundPage: FC = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const initialQuery = queryParams.get("query") || "";

  const [searchText, setSearchText] = useState(initialQuery);
  const [loadingMessageIndex, setLoadingMessageIndex] = useState(0);

  const { queryResponse, queryError, queryLoading, submitQuery } =
    usePlayground();

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (queryLoading) {
      interval = setInterval(() => {
        setLoadingMessageIndex(
          (prevIndex) => (prevIndex + 1) % loadingMessages.length
        );
      }, 2000);
    }
    return () => clearInterval(interval);
  }, [queryLoading]);

  const handleSearch = () => {
    if (searchText) {
      submitQuery(searchText);
    }
  };

  const renderScore = (score: number) => {
    return (
      <div className="flex items-center justify-center w-16 h-16 bg-blue-200 rounded-full">
        <p className="text-xl font-bold">{score.toFixed(1)}</p>
      </div>
    );
  };

  const renderRelatedQuery = (query: string) => {
    // e.g [Apple's earnings growth](what is Apple's earnings growth)
    const queryTitle = query.split("[")[1].split("]")[0]; // content between [ ]
    const queryText = query.split("(")[1].split(")")[0]; // content between ( )
    const url = `/playground?query=${queryText}`;
    return (
      <a href={url} className="text-blue-500 underline" target="_blank">
        {queryTitle}
      </a>
    );
  };

  return (
    <div className="w-screen flex flex-col items-center justify-center bg-white text-gray-800 ">
      <AppBar showLogin={false} />
      <div className="absolute top-5 right-4 flex items-center text-sm font-robotoMono text-gray-600">
        InstanceSample1-FinancialData
        <div className="ml-2 w-2 h-2 bg-green-800 rounded-full animate-pulse"></div>
      </div>

      <div className="flex flex-col items-start space-y-6 my-20 max-w-[600px]">
        {!queryLoading && (
          <p className="text-2xl font-roboto font-semibold">
            What do you want to know?
          </p>
        )}
        {queryLoading ? (
          <div className="text-lg font-robotoMono text-center">
            {searchText}
          </div>
        ) : queryResponse ? (
          <div className="flex flex-col items-start space-y-4">
            <div className="text-lg font-robotoMono text-center">
              {queryResponse.query}
            </div>
            <a
              href="#"
              onClick={() => window.location.reload()}
              className="mt-4 text-blue-500 underline"
            >
              Do another search
            </a>
            <div className="mt-4">
              <h2 className="text-lg font-robotoMono font-bold">Trust Score</h2>
              <div className="mt-4 flex justify-center space-x-8 my-12">
                <div className="flex flex-col items-center">
                  <div className="flex items-center justify-center w-16 h-16 bg-blue-200 rounded-full">
                    <p className="text-xl font-bold">
                      {renderScore(queryResponse.accuracy)}
                    </p>
                  </div>
                  <p className="text-sm mt-2 w-[100px] text-center">Accuracy</p>
                </div>
                <div className="flex flex-col items-center">
                  <div className="flex items-center justify-center w-16 h-16 bg-blue-200 rounded-full">
                    <p className="text-xl font-bold">
                      {renderScore(queryResponse.reliability)}
                    </p>
                  </div>
                  <p className="text-sm mt-2 w-[100px] text-center">
                    Reliability
                  </p>
                </div>
                <div className="flex flex-col items-center">
                  <div className="flex items-center justify-center w-16 h-16 bg-blue-200 rounded-full">
                    <p className="text-xl font-bold">
                      {renderScore(queryResponse.overall_score)}
                    </p>
                  </div>
                  <p className="text-sm mt-2 w-[100px] text-center">
                    Overall Score
                  </p>
                </div>
              </div>
              <div className="">
                <h2 className="text-lg font-robotoMono font-bold my-4">
                  Data Points
                </h2>
                <table className="min-w-full border-collapse border border-gray-300">
                  <thead>
                    <tr>
                      <th className="border border-gray-300 p-2">Date</th>
                      {queryResponse.datapoint_descriptions.map(
                        (description: string, index: number) => (
                          <th
                            key={index}
                            className="border border-gray-300 p-2"
                          >
                            {description}
                          </th>
                        )
                      )}
                    </tr>
                  </thead>
                  <tbody>
                    {queryResponse.date_intervals.map((date, index) => (
                      <tr key={index}>
                        <td className="border border-gray-300 p-2">{date}</td>
                        {queryResponse.facts[index].map(
                          (fact: number, factIndex: number) => (
                            <td
                              key={factIndex}
                              className="border border-gray-300 p-2"
                            >
                              {fact === -1 ? "Not Provided" : fact}
                            </td>
                          )
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            {queryResponse.explanation && (
              <div className="mt-4 text-md font-robotoMono text-left bg-yellow-100 px-2 max-w-[600px]">
                *{queryResponse.explanation}
              </div>
            )}
            <div className="flex space-x-2 mt-4 items-center">
              <p className="font-robotoMono text-sm">Primary Source</p>
              <span
                className={`px-3 py-1 bg-gray-200 text-gray-800 rounded-full text-sm shadow font-robotoMono`}
              >
                {queryResponse.source}
              </span>
            </div>
            {queryResponse.related_queries && (
              <div className="">
                <h2 className="text-lg font-robotoMono font-bold my-4 ">
                  Comparisons
                </h2>
                <p className="text-sm font-robotoMono">
                  See how accuracy compares. Related queries:
                </p>
                <div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-2 font-robotoMono text-sm">
                  <div className="flex flex-wrap gap-2">
                    {queryResponse.related_queries.map((query, index) =>
                      renderRelatedQuery(query)
                    )}
                    <div className="flex items-center space-x-2">
                      <p className="text-sm font-robotoMono">or</p>

                      <a
                        href="#"
                        className="text-blue-500 underline"
                        target="_blank"
                      >
                        Compute Composite Comp
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="flex flex-col space-y-4">
            <div className="relative w-full max-w-md">
              <textarea
                className="w-full min-w-[450px] h-32 p-4 bg-gray-100 text-gray-800 rounded-md shadow focus:outline-none focus:ring-2 focus:ring-blue-500 font-robotoMono"
                placeholder="Type your query here..."
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
              />
              <button
                onClick={handleSearch}
                className={`absolute bottom-4 right-4 p-2 rounded-full shadow transition-all duration-300 ${
                  searchText ? "bg-blue-500" : "bg-gray-300"
                }`}
              >
                <FiArrowRight size={24} className="text-white" />
              </button>
            </div>
            <div className="flex flex-wrap mt-4">
              <Chip label="SEC Filings" />
              <Chip label="IR Materials" />
              <Chip label="OpenWeb" />
            </div>
          </div>
        )}
        {queryLoading && (
          <div className="flex items-center justify-center space-x-2 mt-4">
            <p className="text-lg font-robotoMono w-[400px] text-center text-slate-500">
              {loadingMessages[loadingMessageIndex]}...
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PlaygroundPage;
