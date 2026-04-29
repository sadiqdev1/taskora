import axios from 'axios';
import { useCallback, useEffect, useRef, useState } from 'react';

/**
 * Generic paginated data fetcher for admin endpoints.
 * Usage: const { data, loading, reload, nextPage } = useAdminData('/admin/memes', { search, status });
 */
export function useAdminData(endpoint, params = {}) {
    const [data, setData] = useState([]);
    const [meta, setMeta] = useState(null);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const abortRef = useRef(null);

    const fetch = useCallback(async (pg = 1, reset = true) => {
        abortRef.current?.abort();
        abortRef.current = new AbortController();
        setLoading(true);
        try {
            const res = await axios.get(endpoint, {
                params: { ...params, page: pg },
                signal: abortRef.current.signal,
            });
            const d = res.data;
            setData(reset ? d.data : (p) => [...p, ...d.data]);
            setMeta({ total: d.total, last_page: d.last_page, current_page: d.current_page });
            setPage(pg);
        } catch (e) {
            if (!axios.isCancel(e)) console.error(e);
        }
        setLoading(false);
    }, [endpoint, JSON.stringify(params)]);

    useEffect(() => { fetch(1, true); }, [fetch]);

    return {
        data,
        meta,
        loading,
        reload: () => fetch(1, true),
        goToPage: (pg) => fetch(pg, true),
        currentPage: page,
    };
}

/**
 * Simple one-shot API call with loading + error state.
 */
export async function adminApi(method, url, data = null) {
    const res = await axios({ method, url, data });
    return res.data;
}
