// hooks/useTicketFilters.js
// Manages the filter bar state for the Tickets List page.
// Returns filters object, setters, and a built query string
// ready to append to GET /api/tickets
//
// Usage:
//   const { filters, setFilter, resetFilters, queryString } = useTicketFilters();
//   const { data } = useFetch(`/api/tickets?${queryString}`);

import { useState, useMemo } from 'react';

const DEFAULT_FILTERS = {
  status:            '',   // OPEN | IN_PROGRESS | CLOSED
  asset_id:          '',
  breakdown_type_id: '',
  from:              '',
  to:                '',
  page:              1,
  limit:             20,
};

const useTicketFilters = () => {
  const [filters, setFilters] = useState(DEFAULT_FILTERS);

  // Set a single filter — resets page to 1 on any filter change
  const setFilter = (key, value) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
      // Reset to page 1 whenever a filter changes (not when page changes itself)
      page: key === 'page' ? value : 1,
    }));
  };

  const resetFilters = () => setFilters(DEFAULT_FILTERS);

  // Build the query string — omit empty values
  const queryString = useMemo(() => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, val]) => {
      if (val !== '' && val !== null && val !== undefined) {
        params.set(key, val);
      }
    });
    return params.toString();
  }, [filters]);

  return { filters, setFilter, resetFilters, queryString };
};

export default useTicketFilters;