import useApi from "./useApi";
import { User } from "../core/models";
import constants from "../core/constants";

function useUser() {
  const {
    response: user,
    error,
    loading,
  } = useApi<User>({
    endpoint: `${constants.BACKEND_API_ENDPOINT}/user`,
    method: "GET",
    includeAuthHeader: true,
  });

  return { user, userFetchError: error, userFetchLoading: loading };
}

export default useUser;
