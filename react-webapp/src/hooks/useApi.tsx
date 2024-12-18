// useApi.ts
import { useState, useEffect } from "react";
import axios, { AxiosRequestConfig, Method } from "axios";
import { useAuth0 } from "@auth0/auth0-react";

interface UseApiProps<T> {
  endpoint: string;
  method?: Method;
  data?: any;
  params?: any;
  headers?: Record<string, string>;
  includeAuthHeader?: boolean;
  skip?: boolean; // Optionally skip the initial request
}

interface UseApiReturn<T> {
  response: T | null;
  error: any;
  loading: boolean;
  submit: () => void; // Updated to include submit function
}

function useApi<T>({
  endpoint,
  method = "GET",
  data = null,
  params = null,
  headers = {},
  includeAuthHeader = false,
  skip = false,
}: UseApiProps<T>): UseApiReturn<T> {
  const { getAccessTokenSilently } = useAuth0();
  const [response, setResponse] = useState<T | null>(null);
  const [error, setError] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [shouldFetch, setShouldFetch] = useState<boolean>(!skip);

  const fetchData = async () => {
    setLoading(true);
    try {
      let authHeaders = {};
      if (includeAuthHeader) {
        const token = await getAccessTokenSilently();
        authHeaders = {
          Authorization: `Bearer ${token}`,
        };
      }

      const config: AxiosRequestConfig = {
        url: endpoint,
        method,
        headers: {
          ...headers,
          ...authHeaders,
        },
        data,
        params,
      };

      const result = await axios.request<T>(config);
      setResponse(result.data);
      setError(null);
    } catch (err) {
      setError(err);
      setResponse(null);
    } finally {
      setLoading(false);
    }
  };

  const submit = () => {
    setShouldFetch(true); // Trigger fetch when submit is called
  };

  useEffect(() => {
    if (shouldFetch) {
      fetchData();
      setShouldFetch(false); // Reset after fetching
    }

    // Optionally cancel the request if needed
    // return () => {
    //   // Cancel the request here if you have a cancel token
    // };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shouldFetch]);

  return { response, error, loading, submit }; // Return the submit function
}

export default useApi;
