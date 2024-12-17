import { useState, useEffect } from "react";
import axios from "axios";
import constants from "../core/constants";

// Define the interface for the response data
interface PlaygroundQueryResponse {
  source: string;
  datapoint_descriptions: any; // Adjust type as necessary
  facts: any;
  accuracy: number;
  reliability: number;
  overall_score: number;
  explanation?: string;
  date_intervals: string[];
  query: string;
  related_queries?: string[];
}

const usePlayground = () => {
  const [queryResponse, setQueryResponse] =
    useState<PlaygroundQueryResponse | null>(null);
  const [queryError, setQueryError] = useState<string | null>(null);
  const [queryLoading, setQueryLoading] = useState<boolean>(false);

  const [compsResponse, setCompsResponse] = useState<any>(null);
  const [compsError, setCompsError] = useState<string | null>(null);
  const [compsLoading, setCompsLoading] = useState<boolean>(false);

  const submitQuery = async (query: string) => {
    setQueryLoading(true);
    setQueryError(null);
    try {
      const response = await axios.get(
        `${constants.BACKEND_API_ENDPOINT}/playground/query`,
        {
          params: { query },
        }
      );
      //   const response = {
      //     source: "Meta 10k",
      //     datapoint_descriptions: [
      //       "Earnings Growth",
      //       "Projected Earnings Growth for next year",
      //     ],
      //     facts: [
      //       [0.69, -1.0],
      //       [0.69, -1.0],
      //     ],
      //     accuracy: 0.0,
      //     reliability: 0.0,
      //     overall_score: 0.0,
      //     explanation: "Global pandemic reduced ad spend in 2020",
      //     date_intervals: ["2019-01-01", "2020-01-01"],
      //     query: "Facebook's earnings growth",
      //     related_queries: [
      //       "[SnapChats's earnings growth](what is SnapChat's earnings growth)",
      //       "[Apple's earnings growth](what is Apple's earnings growth)",
      //     ],
      //   };
      setQueryResponse(response.data);
    } catch (error: any) {
      setQueryError(error.message);
    } finally {
      setQueryLoading(false);
    }
  };

  const submitCompRequest = async (query: string) => {
    setCompsLoading(true);
    setCompsError(null);
    try {
      const response = await axios.get(
        `${constants.BACKEND_API_ENDPOINT}/playground/find_comps`,
        {
          params: { query },
        }
      );
      setCompsResponse(response.data);
    } catch (error: any) {
      setCompsError(error.message);
    } finally {
      setCompsLoading(false);
    }
  };

  return {
    queryResponse,
    queryError,
    queryLoading,
    submitQuery,
    compsResponse,
    compsError,
    compsLoading,
    submitCompRequest,
  };
};

export default usePlayground;
