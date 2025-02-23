import { getTodoAdding } from './getTodoAddding';
import { getTodoCheckUpdating } from './getTodoCheckUpdating';
import { getTodoDeleting } from './getTodoDeleting';
import { getTodoTitleChange } from './getTodoTitleChange';

export const todosHandlings = {
  add: getTodoAdding,
  delete: getTodoDeleting,
  checkUpdate: getTodoCheckUpdating,
  titleUpdate: getTodoTitleChange,
};
