import { useQuery } from "@tanstack/react-query";
import { requestJson } from "../lib/api";

const useFetch = (url) =>
  useQuery({
    queryKey: ["http", url],
    queryFn: ({ signal }) => requestJson(url, { signal }),
    enabled: Boolean(url),
  });

export default useFetch;
