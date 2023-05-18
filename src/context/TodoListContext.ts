import { createContext } from 'react';
import { TodoContextData } from '../types/TodoContextData';

export const TodoListContext = createContext<TodoContextData>({
  deletedId: null,
  setDeletedId: () => {},
  editedId: null,
  setEditedId: () => {},
  areAllEdited: false,
  setareAllEdited: () => {},
  areCompletedDel: false,
  setCompletedDel: () => {},
});
