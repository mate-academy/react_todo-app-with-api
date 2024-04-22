import { Filter } from './types/Filter';

export const errorText = {
  noTodos: 'Unable to load todos',
  emptyTitle: 'Title should not be empty',
  failAdding: 'Unable to add a todo',
  failDeleting: 'Unable to delete a todo',
  failUpdating: 'Unable to update a todo',
};

export const allFilters = [Filter.all, Filter.active, Filter.completed];
