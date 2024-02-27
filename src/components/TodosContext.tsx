import React, {
  Dispatch,
  SetStateAction, useCallback, useMemo, useRef, useState,
} from 'react';
import { Todo } from '../types/Todo';
import * as postService from '../api/todos';

type TodosContextType = {
  todos: Todo[];
  setTodos: Dispatch<SetStateAction<Todo[]>>;
  loadingTodos: boolean,
  setLoadingTodos: Dispatch<SetStateAction<boolean>>,
  errorMessage: string,
  setErrorMessage: Dispatch<SetStateAction<string>>,
  errorHidden: boolean,
  setErrorHidden: Dispatch<SetStateAction<boolean>>,
  tempTodo: Todo | null,
  setTempTodo: Dispatch<SetStateAction<Todo | null>>,
  loading: boolean,
  setLoading: Dispatch<SetStateAction<boolean>>,
  selectedTodo: Todo | null,
  setSelectedTodo: Dispatch<SetStateAction<Todo | null>>,
  deleteTodo: (todoId: number) => void,
  updateTodo: (todo: Todo) => void,
  completedTodoIds: number[],
  deleteLoading: boolean,
  setDeleteLoading: Dispatch<SetStateAction<boolean>>,
  toggleAllLoading: boolean,
  setToggleAllLoading: Dispatch<SetStateAction<boolean>>,
  inputRef: React.RefObject<HTMLInputElement> | null,
  focusInput: () => void,
};

export const TodosContext = React.createContext<TodosContextType>({
  todos: [],
  setTodos: () => {},
  loadingTodos: false,
  setLoadingTodos: () => {},
  errorMessage: '',
  setErrorMessage: () => {},
  errorHidden: true,
  setErrorHidden: () => {},
  tempTodo: null,
  setTempTodo: () => {},
  loading: false,
  setLoading: () => {},
  selectedTodo: null,
  setSelectedTodo: () => {},
  deleteTodo: () => {},
  updateTodo: () => {},
  completedTodoIds: [],
  deleteLoading: false,
  setDeleteLoading: () => {},
  toggleAllLoading: false,
  setToggleAllLoading: () => {},
  inputRef: null,
  focusInput: () => {},
});

type Props = {
  children: React.ReactNode,
};

export const TodosProvider: React.FC<Props> = ({ children }) => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loadingTodos, setLoadingTodos] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [errorHidden, setErrorHidden] = useState(true);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [loading, setLoading] = useState(false);
  const [selectedTodo, setSelectedTodo] = useState<Todo | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [toggleAllLoading, setToggleAllLoading] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);

  const focusInput = useCallback(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const deleteTodo = useCallback((todoId: number) => {
    setErrorHidden(true);
    setErrorMessage('');
    setLoading(true);
    setTodos(currentTodos => currentTodos.filter(todo => todo.id !== todoId));

    return postService.removeTodo(todoId)
      .catch((error) => {
        setTodos(todos);
        setErrorHidden(false);
        setErrorMessage('Unable to delete a todo');
        throw error;
      })
      .finally(() => {
        setSelectedTodo(null);
        setLoading(false);
        focusInput();
      });
  }, [todos, focusInput]);

  const updateTodo = useCallback((updatedTodo: Todo) => {
    setLoading(true);
    setErrorHidden(true);
    setErrorMessage('');

    return postService.editTodo(updatedTodo)
      .then(updatedTodoFromApi => {
        setTodos(currentTodos => {
          const newTodos = [...currentTodos];
          const index = newTodos
            .findIndex(foundTodo => foundTodo.id === updatedTodo.id);

          newTodos.splice(index, 1, updatedTodoFromApi);

          return newTodos;
        });
      })
      .catch(error => {
        setErrorHidden(false);
        setErrorMessage('Unable to update a todo');
        setTodos(todos);
        throw error;
      })
      .finally(() => {
        setLoading(false);
        setSelectedTodo(null);
      });
  }, [todos]);

  const completedTodoIds = todos
    .filter(todo => todo.completed).map(todo => todo.id);

  const values = useMemo(() => ({
    todos,
    setTodos,
    loadingTodos,
    setLoadingTodos,
    errorMessage,
    setErrorMessage,
    errorHidden,
    setErrorHidden,
    tempTodo,
    setTempTodo,
    loading,
    setLoading,
    selectedTodo,
    setSelectedTodo,
    deleteTodo,
    updateTodo,
    completedTodoIds,
    deleteLoading,
    setDeleteLoading,
    toggleAllLoading,
    setToggleAllLoading,
    inputRef,
    focusInput,
  }), [
    todos, setTodos, loadingTodos, setLoadingTodos, errorMessage,
    setErrorMessage, errorHidden, setErrorHidden, tempTodo, setTempTodo,
    loading, setLoading, selectedTodo, setSelectedTodo, deleteTodo, updateTodo,
    completedTodoIds, deleteLoading, setDeleteLoading, toggleAllLoading,
    setToggleAllLoading, inputRef, focusInput,
  ]);

  return (
    <TodosContext.Provider value={values}>
      {children}
    </TodosContext.Provider>
  );
};
