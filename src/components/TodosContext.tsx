import React, {
  Dispatch,
  SetStateAction, useCallback, useMemo, useState,
} from 'react';
import { Status, Todo } from '../types/Todo';
import * as postService from '../api/todos';

type TodosContextType = {
  todos: Todo[];
  setTodos: Dispatch<SetStateAction<Todo[]>>;
  selectedStatus: Status;
  setSelectedStatus: Dispatch<SetStateAction<Status>>;
  title: string,
  setTitle: Dispatch<SetStateAction<string>>,
  visibleTodos: Todo[],
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
  selectedTodos: Todo[],
  setSelectedTodos: Dispatch<SetStateAction<Todo[]>>,
  comnpletedTodoIds: number[],
  groupTodosLoading: boolean,
  setGroupTodosLoading: Dispatch<SetStateAction<boolean>>,
};

export const TodosContext = React.createContext<TodosContextType>({
  todos: [],
  setTodos: () => {},
  selectedStatus: Status.all,
  setSelectedStatus: () => {},
  title: '',
  setTitle: () => {},
  visibleTodos: [],
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
  selectedTodos: [],
  setSelectedTodos: () => {},
  comnpletedTodoIds: [],
  groupTodosLoading: false,
  setGroupTodosLoading: () => {},
});

type Props = {
  children: React.ReactNode,
};

export const TodosProvider: React.FC<Props> = ({ children }) => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [selectedStatus, setSelectedStatus] = useState(Status.all);
  const [title, setTitle] = useState('');

  const [loadingTodos, setLoadingTodos] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [errorHidden, setErrorHidden] = useState(true);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [loading, setLoading] = useState(false);
  const [selectedTodo, setSelectedTodo] = useState<Todo | null>(null);
  const [selectedTodos, setSelectedTodos] = useState<Todo[]>([]);
  const [groupTodosLoading, setGroupTodosLoading] = useState(false);

  const visibleTodos = [...todos].filter(todo => {
    switch (selectedStatus) {
      case Status.active:
        return !todo.completed;

      case Status.completed:
        return todo.completed;

      default:
        return true;
    }
  });

  const deleteTodo = useCallback((todoId: number) => {
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
      });
  }, [todos]);

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

  const comnpletedTodoIds = todos
    .filter(todo => todo.completed).map(todo => todo.id);

  const values = useMemo(() => ({
    todos,
    setTodos,
    selectedStatus,
    setSelectedStatus,
    title,
    setTitle,
    visibleTodos,
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
    selectedTodos,
    setSelectedTodos,
    comnpletedTodoIds,
    groupTodosLoading,
    setGroupTodosLoading,
  }), [
    todos, setTodos, selectedStatus, title, visibleTodos,
    loadingTodos, setLoadingTodos, errorMessage, setErrorMessage,
    errorHidden, setErrorHidden, tempTodo, setTempTodo, loading,
    setLoading, selectedTodo,
    setSelectedTodo, deleteTodo, updateTodo, selectedTodos, setSelectedTodos,
    comnpletedTodoIds, groupTodosLoading, setGroupTodosLoading,
  ]);

  return (
    <TodosContext.Provider value={values}>
      {children}
    </TodosContext.Provider>
  );
};
