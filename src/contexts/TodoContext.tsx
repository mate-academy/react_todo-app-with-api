import React, { useMemo, useState } from 'react';
import { Todo } from '../types/Todo';
import { Filtering } from '../types/Filtering';
import { TempTodo } from '../types/TempTodo';
import { deleteTodo } from '../api/todos';
import { Error } from '../types/Error';

export interface TodoContextType {
  todos: Todo[];
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>;
  filtering: Filtering;
  setFiltering: React.Dispatch<React.SetStateAction<Filtering>>;
  errorMessage: string;
  setErrorMessage: React.Dispatch<React.SetStateAction<string>>
  tempTodo: TempTodo | null;
  setTempTodo: React.Dispatch<React.SetStateAction<TempTodo | null>>
  editingTodo: Todo | {}
  setEditingTodo: React.Dispatch<React.SetStateAction<Todo>>
  loadingTodo: Todo[]
  setLoadingTodo: React.Dispatch<React.SetStateAction<Todo[]>>
  handleDeleteTodo: (todoId: number, todoToDelete?: Todo) => void
}

export const TodoContext = React.createContext<TodoContextType>({
  todos: [],
  setTodos: () => {},
  filtering: Filtering.All,
  setFiltering: () => {},
  errorMessage: '',
  setErrorMessage: () => {},
  tempTodo: null,
  setTempTodo: () => {},
  editingTodo: {},
  setEditingTodo: () => {},
  loadingTodo: [],
  setLoadingTodo: () => {},
  handleDeleteTodo: () => {},
});

interface Props {
  children: React.ReactNode
}

export const TodoProvider: React.FC<Props> = ({ children }) => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filtering, setFiltering] = useState(Filtering.All);
  const [errorMessage, setErrorMessage] = useState('');
  const [tempTodo, setTempTodo] = useState<TempTodo | null>(null);
  const [editingTodo, setEditingTodo] = useState({} as Todo);
  const [loadingTodo, setLoadingTodo] = useState<Todo[]>([]);

  const handleDeleteTodo = (
    todoId: number,
    todoToDelete: Todo | null = null,
  ) => {
    if (todoToDelete) {
      setLoadingTodo(currentTodos => [...currentTodos, todoToDelete]);
    }

    deleteTodo(todoId)
      .then(() => setTodos((prev) => prev.filter((t) => t.id !== todoId)))
      .catch(() => setErrorMessage(Error.Delete))
      .finally(() => setLoadingTodo([]));
  };

  const value: TodoContextType = useMemo(() => (
    {
      todos,
      setTodos,
      filtering,
      setFiltering,
      errorMessage,
      setErrorMessage,
      tempTodo,
      setTempTodo,
      editingTodo,
      setEditingTodo,
      loadingTodo,
      setLoadingTodo,
      handleDeleteTodo,
    }
  ), [
    todos,
    filtering,
    errorMessage,
    tempTodo,
    editingTodo,
    loadingTodo]);

  return (
    <TodoContext.Provider value={value}>
      {children}
    </TodoContext.Provider>
  );
};
