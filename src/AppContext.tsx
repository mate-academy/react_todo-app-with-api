import React,
{
  useCallback,
  useMemo,
  useState,
} from 'react';

import { Todo } from './types/Todo';
import { FilterBy } from './types/Filter';
import { ErrorType } from './types/Errors';
import * as todoService from './api/todos';
import { USER_ID } from './utils/userId';

interface IAppContext {
  todos: Todo[],
  setTodos: (todos: Todo[]) => void,
  filterBy: FilterBy,
  setFilterBy: (arg: FilterBy) => void,
  errorMessage: ErrorType | null,
  setErrorMessage: (arg: ErrorType | null) => void,
  clearCompleted: () => void,
  selectedTodoIds: number[],
  setSelectedTodoIds: (arg: number[]) => void
  todoTitle: string,
  setTodoTitle: (arg: string) => void,
  isLoading: boolean,
  createNewTodo: (title: string) => void,
  tempTodo: Todo | null,
  setTempTodo: (arg: Todo | null) => void,
  deleteTodo: (arg: number) => void,
  updateTodo: (arg: Todo) => void,
  shouError: (error: ErrorType) => void,
  handleToggleCompleted: (arg: Todo) => void,
  toggleAllTodos: () => void,
}

export const AppContext = React.createContext<IAppContext>({
  todos: [],
  setTodos: () => { },
  filterBy: FilterBy.All,
  setFilterBy: () => { },
  errorMessage: null,
  setErrorMessage: () => { },
  clearCompleted: () => { },
  selectedTodoIds: [],
  setSelectedTodoIds: () => { },
  todoTitle: '',
  setTodoTitle: () => { },
  isLoading: false,
  createNewTodo: () => { },
  tempTodo: null,
  setTempTodo: () => { },
  deleteTodo: () => { },
  updateTodo: () => { },
  shouError: () => { },
  toggleAllTodos: () => { },
  handleToggleCompleted: () => { },
});

type Props = {
  children: React.ReactNode
};

export const AppProvider: React.FC<Props> = ({ children }) => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filterBy, setFilterBy] = useState(FilterBy.All);
  const [errorMessage, setErrorMessage] = useState<ErrorType | null>(null);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [todoTitle, setTodoTitle] = useState('');
  const [selectedTodoIds, setSelectedTodoIds] = useState<number[]>([]);

  const showError = useCallback((error: ErrorType) => {
    setErrorMessage(error);
    setTimeout(() => {
      setErrorMessage(null);
    }, 2000);
  }, [setErrorMessage]);

  const deleteTodo = useCallback(
    async (todoId: number) => {
      try {
        setSelectedTodoIds(currentIds => [...currentIds, todoId]);
        await todoService.deleteTodo(todoId);

        setTodos(currentTodos => currentTodos
          .filter(post => post.id !== todoId));
      } catch (error) {
        showError(ErrorType.UnableToDeleteTodo);
      } finally {
        setSelectedTodoIds(ids => ids.filter(id => id !== todoId));
      }
    }, [showError, setTodos, setSelectedTodoIds],
  );

  const createNewTodo = useCallback(async (title: string) => {
    try {
      setIsLoading(true);
      setSelectedTodoIds(ids => [...ids, 0]);

      setTempTodo({
        id: 0,
        userId: USER_ID,
        title,
        completed: false,
      });

      const newTodo = await todoService.createTodo({
        userId: USER_ID,
        title,
        completed: false,
      });

      setTodoTitle('');

      setTodos(currentTodos => [...currentTodos, newTodo]);
    } catch (error) {
      showError(ErrorType.UnableToAddTodo);
    } finally {
      setIsLoading(false);
      setSelectedTodoIds(ids => ids.filter(id => id !== 0));
      setTempTodo(null);
    }
  }, [showError,
    setTodos,
    setSelectedTodoIds,
    setIsLoading,
    setTempTodo,
    setTodoTitle]);

  const updateTodo = useCallback((todo: Todo) => {
    setIsLoading(true);
    setSelectedTodoIds((ids) => [...ids, todo.id]);

    todoService.updateTodo(todo)
      .then(() => {
        setTodos(currentTodos => (
          currentTodos.map(currentTodo => (
            currentTodo.id === todo.id
              ? todo
              : currentTodo
          ))
        ));
      })
      .catch(() => {
        showError(ErrorType.UnableToUpdateTodo);
      })
      .finally(() => {
        setSelectedTodoIds(ids => ids.filter(
          id => id !== todo.id,
        ));

        setIsLoading(false);
      });
  }, [showError]);

  const clearCompleted = useCallback(
    () => {
      const completedTodos = todos
        .filter(todoToFind => todoToFind.completed);

      setSelectedTodoIds(currentIds => (
        [...currentIds, ...completedTodos
          .map(completedTodo => completedTodo.id),
        ]
      ));

      completedTodos.map(completedTodo => todoService
        .deleteTodo(completedTodo.id));

      setTimeout(() => {
        setTodos(currentTodos => currentTodos.filter(
          todoToFilter => !todoToFilter.completed,
        ));
      }, 500);
    }, [todos],
  );

  const handleToggleCompleted = useCallback(
    async (todoChange: Todo) => {
      try {
        setSelectedTodoIds((currentIds) => [...currentIds, todoChange.id]);
        const updatedTodo = {
          ...todoChange,
          completed: !todoChange.completed,
        };

        const updatedTodos = await todoService.updateTodo(updatedTodo);

        setTodos((currentTodos) => {
          const newTodos = [...currentTodos];
          const index = newTodos.findIndex(
            (newTodo) => newTodo.id === updatedTodo.id,
          );

          newTodos.splice(index, 1, updatedTodos);

          return newTodos;
        });
      } catch (error) {
        showError(ErrorType.UnableToUpdateTodo);
      } finally {
        setSelectedTodoIds((ids) => ids.filter((id) => id !== todoChange.id));
      }
    },
    [showError, setTodos, setSelectedTodoIds],
  );

  const toggleAllTodos = useCallback(
    () => {
      const notCompleted = todos.every(todo => todo.completed);

      if (!notCompleted) {
        const allCompleted = todos.map(todo => {
          if (!todo.completed) {
            handleToggleCompleted(todo);
          }

          return todo;
        });

        setTodos(allCompleted);
      } else {
        const allNotCompleted = todos.map(todo => {
          handleToggleCompleted(todo);

          return todo;
        });

        setTodos(allNotCompleted);
      }
    }, [todos, handleToggleCompleted],
  );

  const value = useMemo(() => ({
    todos,
    setTodos,
    filterBy,
    setFilterBy,
    errorMessage,
    setErrorMessage,
    clearCompleted,
    selectedTodoIds,
    setSelectedTodoIds,
    todoTitle,
    setTodoTitle,
    isLoading,
    createNewTodo,
    tempTodo,
    setTempTodo,
    deleteTodo,
    updateTodo,
    shouError: showError,
    handleToggleCompleted,
    toggleAllTodos,
  }), [
    todos,
    setTodos,
    filterBy,
    setFilterBy,
    errorMessage,
    setErrorMessage,
    clearCompleted,
    selectedTodoIds,
    setSelectedTodoIds,
    todoTitle,
    setTodoTitle,
    isLoading,
    createNewTodo,
    tempTodo,
    setTempTodo,
    deleteTodo,
    updateTodo,
    showError,
    handleToggleCompleted,
    toggleAllTodos,
  ]);

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};
