import { Todo } from '../types/Todo';
import { FilterParams } from '../types/FilterParams';

export const getFilteredTodos
 = (todos: Todo[], completionStatus: FilterParams) => {
   if (completionStatus === 'All') {
     return [...todos];
   }

   const isCompleted = completionStatus === FilterParams.Completed;

   return todos.filter(({ completed }) => completed === isCompleted);
 };
