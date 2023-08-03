import React, { useEffect, useState } from 'react';
import { getTodos } from '../api/todos';
import { FilterBy, Todo } from '../types/Todo';
import { ErrorType } from '../types/Error';

const USER_ID = 11144;

interface Todos {
  USER_ID: number;
  todos: Todo[];
  tempTodo: Todo | null;
  filterBy: FilterBy;
  errorMessage: string;
  toggleStatus: boolean;
  isAllTodosCompleted: boolean;
  processingIds: number[];
  onAddTodo: (newTodo: Todo) => void;
  onDeleteTodo: (todoId: number) => void;
  onUpdateTodo: (editedTodo: Todo) => void;
  setFilterBy: (filter: FilterBy) => void;
  setErrorMessage: (error: string) => void;
  setTempTodo: (tempTodo: Todo | null) => void;
  setToggleStatus: (v: boolean | ((v: boolean) => boolean)) => void;
  setProcessingIds: (ids: number[] | ((ids: number[]) => number[])) => void;
}

export const TodosContext = React.createContext<Todos>({
  USER_ID,
  todos: [],
  tempTodo: null,
  filterBy: FilterBy.ALL,
  errorMessage: '',
  toggleStatus: false,
  isAllTodosCompleted: false,
  processingIds: [],
  onAddTodo: () => {},
  onDeleteTodo: () => {},
  onUpdateTodo: () => {},
  setFilterBy: () => {},
  setErrorMessage: () => {},
  setTempTodo: () => {},
  setToggleStatus: () => {},
  setProcessingIds: () => {},
});

interface Props {
  children: React.ReactNode;
}

export const TodosProvider: React.FC<Props> = ({ children }) => {
  const [errorMessage, setErrorMessage] = useState('');
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filterBy, setFilterBy] = useState<FilterBy>(FilterBy.ALL);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [toggleStatus, setToggleStatus] = useState(false);
  const [processingIds, setProcessingIds] = useState<number[]>([]);

  useEffect(() => {
    getTodos(USER_ID)
      .then(setTodos)
      .catch(() => {
        setErrorMessage(ErrorType.fetchTodo);
        throw new Error(ErrorType.fetchTodo);
      });
  }, []);

  function onAddTodo(newTodo: Todo) {
    setTodos(currentTodos => [...currentTodos, newTodo]);
  }

  function onDeleteTodo(todoId: number) {
    setTodos(currentTodos => currentTodos.filter(
      todo => todo.id !== todoId,
    ));
  }

  function onUpdateTodo(editedTodo: Todo) {
    setTodos(currentTodos => currentTodos.map(
      todo => (todo.id === editedTodo.id ? editedTodo : todo),
    ));
  }

  const isAllTodosCompleted = React.useMemo(() => {
    return todos.every(todo => todo.completed);
  }, [todos]);

  const todosValues = {
    USER_ID,
    todos,
    tempTodo,
    filterBy,
    errorMessage,
    toggleStatus,
    isAllTodosCompleted,
    processingIds,
    onAddTodo,
    onDeleteTodo,
    onUpdateTodo,
    setFilterBy,
    setErrorMessage,
    setTempTodo,
    setToggleStatus,
    setProcessingIds,
  };

  return (
    <TodosContext.Provider value={todosValues}>
      {children}
    </TodosContext.Provider>
  );
};
