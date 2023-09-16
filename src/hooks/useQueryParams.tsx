import { useMemo } from "react";
import { useLocation } from "react-router-dom";

// https://v5.reactrouter.com/web/example/query-parameters
function useQueryParams() {
    const { search } = useLocation();
    return useMemo(() => new URLSearchParams(search), [search]);
}

export default useQueryParams;