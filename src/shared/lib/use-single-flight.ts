import { useState } from 'react';

import { createSingleFlight, type SingleFlight } from '@/shared/lib/single-flight';

/** One single-flight guard for the lifetime of the component that calls this. */
export function useSingleFlight(): SingleFlight {
  const [singleFlight] = useState(createSingleFlight);

  return singleFlight;
}
