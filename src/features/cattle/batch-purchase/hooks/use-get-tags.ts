import { useQuery } from "@tanstack/react-query";
import { getNextTagNumber } from "../actions/get-tag-number";

export function useGetTags() {
    const { data, isLoading, error } = useQuery({
        queryKey: ["tags"],
        queryFn: () => getNextTagNumber(),
    });

    return { nextTagNumber: data, isTagNumberLoading: isLoading, tagNumberError: error };
}