import { createContext, ReactNode, useMemo, RefObject } from 'react';
import { TodoErrors } from '../utils/enums/TodoErrors';
import { Todo } from '../types/Todo';
import { useTodoInput } from '../hooks/useTodoInput';
import { useTodoErrors } from '../hooks/useTodoErrors';
import { useTodos } from '../hooks/useTodos';

interface ITodosContext {
  todos: Todo[];
  error: TodoErrors | null;
  tempTodo: Todo | null;
  inputRef: RefObject<HTMLInputElement> | null;

  onFocus: () => void;
  fetchTodos: () => void;
  addTodo: (title: string) => Promise<Todo | void>;
  deleteTodo: (todoId: number) => Promise<number | void>;
  deleteCompletedTodos: () => Promise<void>;
  updateTodo: (todo: Todo) => Promise<Todo | void>;
  updatedAllTodo: () => Promise<void>;
  showError: (err: TodoErrors) => void;
}

export const TodosContext = createContext<ITodosContext>({
  todos: [],
  error: null,
  tempTodo: null,
  inputRef: null,

  fetchTodos: () => {},
  addTodo: async () => {},
  deleteTodo: async () => {},
  deleteCompletedTodos: async () => {},
  updateTodo: async () => {},
  updatedAllTodo: async () => {},
  showError: () => {},
  onFocus: () => {},
});

export const TodosProvider = ({
  children,
}: {
  children: ReactNode;
}): ReactNode => {
  const { error, showError } = useTodoErrors();
  const { inputRef, onFocus } = useTodoInput();
  const {
    todos,
    tempTodo,
    fetchTodos,
    addTodo,
    deleteTodo,
    deleteCompletedTodos,
    updateTodo,
    updatedAllTodo,
  } = useTodos(showError);

  const store = useMemo(
    () => ({
      todos,
      tempTodo,
      error,
      inputRef,

      fetchTodos,
      addTodo,
      deleteTodo,
      showError,
      deleteCompletedTodos,
      updateTodo,
      updatedAllTodo,
      onFocus,
    }),
    [todos, error, tempTodo, inputRef],
  );

  return (
    <TodosContext.Provider value={store}>{children}</TodosContext.Provider>
  );
};
