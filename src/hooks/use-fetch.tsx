import { useState } from "react";
import { toast } from "sonner";

function useFetch<T = any>(cb: (...args: any[]) => Promise<T>) {
    const [data, setData] = useState<T | undefined>(undefined);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchData = async (...args: any[]) => {
        setLoading(true);
        setError(null);

        try {
            const data = await cb(...args);
            setData(data);
        } catch (error) {
            setError(error instanceof Error ? (error as Error).message : String(error));
            toast.error("Error fetching data");
        } finally {
            setLoading(false);
        }
    }

    return { data, loading, error, fetchData };
}

export default useFetch;