import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react';
import { Todo } from './types/Todo';
import { Status } from './types/Status';
import * as todoService from './api/todos';
import { USER_ID } from './userId/userId';
import { ErrorType } from './types/ErrorType';

interface AppContextType {
  todos: Todo[],
  status: Status
  setTodos: (arg: Todo[]) => void,
  setStatus: (arg: Status) => void,
  deleteTodo: (arg: number) => void,
  selectedTodoIds: number[],
  setSelectedTodoIds: (arg: number[]) => void
  handleToggleCompleted: (arg: Todo) => void,
  clearCompleted: () => void,
  todoTitle: string,
  setTodoTitle: (arg: string) => void,
  tempTodo: Todo | null,
  setTempTodo: (arg: Todo | null) => void,
  addTodo: (arg: string) => void,
  error: ErrorType | null,
  setError: (arg: ErrorType | null) => void,
  loadind: boolean,
  setLoading: (arg: boolean) => void,
  updateTodo: (arg: Todo) => void,
  handleToggleCompletedAll: () => void,
  handleError: (errorMessage: ErrorType) => void,
}

export const AppContext = createContext<AppContextType>({
  todos: [],
  status: Status.all,
  setTodos: () => { },
  setStatus: () => { },
  deleteTodo: () => { },
  selectedTodoIds: [],
  setSelectedTodoIds: () => { },
  handleToggleCompleted: () => { },
  clearCompleted: () => { },
  todoTitle: '',
  setTodoTitle: () => { },
  tempTodo: null,
  setTempTodo: () => { },
  addTodo: () => { },
  error: null,
  setError: () => { },
  loadind: false,
  setLoading: () => { },
  updateTodo: () => { },
  handleToggleCompletedAll: () => { },
  handleError: () => { },
});

type Props = {
  children: React.ReactNode
};

export const AppProvider: React.FC<Props> = ({ children }) => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [status, setStatus] = useState<Status>(Status.all);
  const [selectedTodoIds, setSelectedTodoIds] = useState<number[]>([]);
  const [todoTitle, setTodoTitle] = useState('');
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [error, setError] = useState<ErrorType | null>(null);
  const [loadind, setLoading] = useState(false);

  const handleError = useCallback(
    (errorMessage: ErrorType) => {
      setError(errorMessage);
      setTimeout(() => setError(null), 2000);
    }, [],
  );

  const deleteTodo = useCallback(
    (todoId: number) => {
      setSelectedTodoIds(currentIds => [...currentIds, todoId]);
      todoService.deleteTodo(todoId)
        .then(() => {
          setTimeout(() => {
            setTodos(currentTodos => currentTodos
              .filter(post => post.id !== todoId));
          }, 500);
        })
        .catch(() => {
          handleError(ErrorType.cantDeleteTodo);
        })
        .finally(() => setTimeout(
          () => setSelectedTodoIds(ids => ids.filter(id => id !== todoId)),
          500,
        ));
    }, [handleError],
  );

  const clearCompleted = useCallback(
    () => {
      const completedTodos = todos.filter(
        todoToFind => todoToFind.completed,
      );

      setSelectedTodoIds(currentIds => (
        [...currentIds, ...completedTodos
          .map(completedTodo => completedTodo.id),
        ]
      ));

      const deletePromises = completedTodos.map(completedTodo => (
        todoService.deleteTodo(completedTodo.id)
      ));

      Promise.all(deletePromises)
        .then(() => {
          setTodos(currentTodos => currentTodos.filter(
            todoToFilter => !todoToFilter.completed,
          ));
        })
        .catch(() => handleError(ErrorType.cantDeleteTodo))
        .finally(() => completedTodos.map(
          completedTodo => setSelectedTodoIds(ids => ids.filter(
            id => id !== completedTodo.id,
          )),
        ));
    }, [todos, handleError],
  );

  const handleToggleCompleted = useCallback(
    (todoToChange: Todo) => {
      setSelectedTodoIds(currentIds => [...currentIds, todoToChange.id]);
      const updatedTodo = {
        ...todoToChange,
        completed: !todoToChange.completed,
      };

      todoService.setCompleted(updatedTodo)
        .then(todo => {
          setTodos(currentTodos => {
            const newTodos = [...currentTodos];
            const index = newTodos.findIndex(newTodo => (
              newTodo.id === updatedTodo.id
            ));

            newTodos[index] = todo;

            return newTodos;
          });
        })
        .catch(() => handleError(ErrorType.cantUpdateTodo))
        .finally(() => setTimeout(
          () => setSelectedTodoIds(ids => ids.filter(
            (id => id !== todoToChange.id),
          )),
        ));
    }, [handleError],
  );

  const handleToggleCompletedAll = useCallback(
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

  const addTodo = useCallback(
    (title: string) => {
      setLoading(true);
      setSelectedTodoIds(ids => [...ids, 0]);
      setTempTodo({
        id: 0,
        userId: USER_ID,
        title,
        completed: false,
      });

      todoService.createTodo({
        userId: USER_ID,
        title,
        completed: false,
      })
        .then(newTodo => {
          setTodoTitle('');
          setTimeout(() => {
            setTodos(currentTodos => [...currentTodos, newTodo]);
          }, 500);
        })
        .catch(() => {
          handleError(ErrorType.cantAddTodo);
        })
        .finally(() => {
          setLoading(false);
          setSelectedTodoIds(ids => ids.filter(
            id => id !== 0,
          ));
          setTimeout(() => setTempTodo(null), 500);
        });
    }, [handleError],
  );

  const updateTodo = useCallback(
    (updatedTodo: Todo) => {
      setLoading(true);
      setSelectedTodoIds(ids => [...ids, updatedTodo.id]);

      todoService.updateTodo(updatedTodo)
        .then(() => {
          setTodos(currentTodos => (
            currentTodos.map(currentTodo => (
              currentTodo.id === updatedTodo.id
                ? updatedTodo
                : currentTodo
            ))
          ));
        })
        .catch(() => {
          handleError(ErrorType.cantUpdateTodo);
        })
        .finally(() => {
          setSelectedTodoIds(ids => ids.filter(
            id => id !== updatedTodo.id,
          ));
          setLoading(false);
        });
    }, [handleError],
  );

  const value = useMemo(() => ({
    todos,
    status,
    setTodos,
    setStatus,
    deleteTodo,
    selectedTodoIds,
    setSelectedTodoIds,
    handleToggleCompleted,
    clearCompleted,
    todoTitle,
    setTodoTitle,
    tempTodo,
    setTempTodo,
    addTodo,
    error,
    setError,
    loadind,
    setLoading,
    updateTodo,
    handleToggleCompletedAll,
    handleError,
  }), [
    todos,
    status,
    selectedTodoIds,
    deleteTodo,
    handleToggleCompleted,
    clearCompleted,
    todoTitle,
    tempTodo,
    error,
    loadind,
    updateTodo,
    handleToggleCompletedAll,
    addTodo,
    handleError,
  ]);

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);
