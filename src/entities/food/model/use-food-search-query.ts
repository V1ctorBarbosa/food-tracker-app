import { useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';

import { useSession } from '@/entities/session';
import { getJson } from '@/shared/api/http-client';

import type { Food } from './food.types';

const SearchDebounceMs = 400;
const MinimumSearchTextLength = 3;

export function useFoodSearchQuery(searchText: string) {
  const session = useSession();
  const trimmedSearchText = searchText.trim();
  const debouncedSearchText = useDebouncedValue(trimmedSearchText, SearchDebounceMs);
  const isSearchTextLongEnough = debouncedSearchText.length >= MinimumSearchTextLength;

  const query = useQuery({
    queryKey: ['foods', 'search', debouncedSearchText],
    queryFn: () => getJson<Food[]>(`/foods/search?q=${encodeURIComponent(debouncedSearchText)}`),
    enabled: session.status === 'signed-in' && isSearchTextLongEnough,
  });

  // While the debounce timer hasn't fired yet, `query` still reflects the PREVIOUS search term
  // (including its stale `data`), so `query.isPending` alone would miss this window -- e.g. typing
  // over an existing search shows old results with no loading feedback until the new query starts.
  const isWaitingForDebounce =
    trimmedSearchText !== debouncedSearchText && trimmedSearchText.length >= MinimumSearchTextLength;

  return { ...query, isSearching: isWaitingForDebounce || query.isPending };
}

function useDebouncedValue<TValue>(value: TValue, delayMs: number): TValue {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timeoutId = setTimeout(() => setDebouncedValue(value), delayMs);
    return () => clearTimeout(timeoutId);
  }, [value, delayMs]);

  return debouncedValue;
}
