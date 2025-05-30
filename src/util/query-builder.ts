import { ColumnFiltersState } from "@tanstack/react-table";

interface FilterQuery {
  filter: Record<string, any>;
}

// Helper function to set nested value
const setNestedValue = (obj: any, path: string[], value: any) => {
  let current = obj;
  for (let i = 0; i < path.length - 1; i++) {
    const key = path[i];
    current[key] = current[key] || {};
    current = current[key];
  }
  current[path[path.length - 1]] = value;
};

export const formatFilters = (columnFilters: ColumnFiltersState) => {
  const filterQuery: FilterQuery = { filter: {} };

  columnFilters.forEach((filter) => {
    const values = filter.value as string[];
    if (!values?.length) return;

    const path = filter.id.split(".");
    const filterValue = values.length > 1 ? { $in: values } : values[0];

    setNestedValue(filterQuery.filter, path, filterValue);
  });

  return filterQuery;
};
