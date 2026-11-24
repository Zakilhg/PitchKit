import useFetch from "./useFetch";
import { apiUrl } from "@/lib/api";

const EMPTY = [];

/** The whole catalog. Every page shares one cached request. */
const useJerseys = (enabled = true) => {
  const query = useFetch(enabled ? apiUrl("jerseys") : null);
  return { ...query, jerseys: query.data?.data ?? EMPTY };
};

export default useJerseys;
