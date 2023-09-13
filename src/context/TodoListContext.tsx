import { createContext } from 'react';
import { Todo } from '../types/Todo';

interface TodoListContextType {
  visibleTodos: Todo[];
  tempTodo: Todo | null,
  completedTodoIdList: number[],
  handleTodoRename: (todoId: number, title: string) => void,
  handleToggleButtonClick: (todoId: number, completed: boolean) => void,
  handleRemoveButtonClick: (todoId: number) => void,
}

export const TodoListContext = createContext<TodoListContextType>({
  visibleTodos: [],
  tempTodo: null,
  completedTodoIdList: [],
  handleTodoRename: () => {},
  handleToggleButtonClick: () => {},
  handleRemoveButtonClick: () => {},
});
