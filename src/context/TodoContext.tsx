/* eslint-disable no-console */
import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import {
  createTodo,
  deleteTodo,
  getTodos,
  updateTodo,
} from '../api/todos';
import { Todo, TodoStatus } from '../types/Todo';

type Props = {
  children: React.ReactNode,
};

export interface ProvidedValue {
  todos: Todo[],
  tempTodo: Todo | null,
  todosContainer: Todo[],
  completedTodos: Todo[],
  selectedStatus: TodoStatus,
  errorMessage: string,
  processed: number[],
  USER_ID: number,
  filterByStatus: (status: TodoStatus) => void,
  onCreateTodo: (newTodo: Omit<Todo, 'id'>) => void,
  onError: (error: string) => void,
  onDeleteTodo: (todoId: number) => void,
  onDeleteCompleted: () => Promise<void>,
  onUpdateStatus: (todo: Todo) => void,
  onUpdateAllStatus: () => Promise<void>,
  onUpdateTitle: (todoToUpdate: Todo, newTitle: string) => void,
}

const USER_ID = 11033;

export const TodoContext = createContext({} as ProvidedValue);

export const TodoContextProvider = ({ children }: Props) => {
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [todosContainer, setTodosContainer] = useState<Todo[]>([]);
  const [selectedStatus, setSelectedStatus] = useState(TodoStatus.All);
  const [errorMessage, setErrorMessage] = useState('');
  const [processed, setProcessed] = useState<number[]>([]);

  const completedTodos = useMemo(() => {
    return todosContainer.filter((todo) => todo.completed);
  }, [todosContainer]);

  const visibleTodos = useMemo(() => todosContainer.filter(todo => {
    switch (selectedStatus) {
      case TodoStatus.Active:
        return !todo.completed;
      case TodoStatus.Completed:
        return todo.completed;
      default:
        return todo;
    }
  }), [todosContainer, selectedStatus]);

  useEffect(() => {
    getTodos(USER_ID)
      .then((res) => {
        setTodosContainer(res);
      })
      .catch((error) => {
        throw error;
      });
  }, []);

  const filterByStatus = useCallback((status: TodoStatus) => {
    setSelectedStatus(status);
  }, []);

  const onError = useCallback((error: string) => {
    setErrorMessage(error);
  }, []);

  const handleTempTodo = useCallback((todo?: Todo) => {
    if (todo) {
      setTempTodo(todo);
    } else {
      setTempTodo(null);
    }
  }, []);

  const onCreateTodo = useCallback((newTodo: Omit<Todo, 'id'>) => {
    handleTempTodo({ ...newTodo, id: 0 });
    setProcessed([...processed, 0]);
    createTodo(newTodo).then((res) => {
      setTodosContainer([...todosContainer, res]);
    }).catch(() => {
      onError('Unable to add a todo');
    })
      .finally(() => {
        handleTempTodo();
        setProcessed(processed);
      });
  }, [todosContainer]);

  const onDeleteTodo = useCallback((todoId: number) => {
    setProcessed([...processed, todoId]);
    deleteTodo(todoId)
      .then(() => {
        setTodosContainer(todosContainer.filter(todo => todo.id !== todoId));
      })
      .catch(() => onError('Unable to delete the todo'))
      .finally(() => setProcessed(processed));
  }, [todosContainer]);

  const onDeleteCompleted = useCallback(async () => {
    const deletePromises = completedTodos.map(todo => deleteTodo(todo.id));

    try {
      const ids = completedTodos.map(todo => todo.id);

      setProcessed([...processed, ...ids]);

      await Promise.all(deletePromises);
      setTodosContainer(todosContainer.filter(todo => !todo.completed));
    } catch (error) {
      onError('Unable to delete the todo');
    } finally {
      setProcessed(processed);
    }
  }, [todosContainer]);

  const onUpdateStatus = useCallback((todoToUpdate: Todo) => {
    const newStatus = !todoToUpdate.completed;

    setProcessed([...processed, todoToUpdate.id]);
    updateTodo(todoToUpdate.id, { ...todoToUpdate, completed: newStatus })
      .then(updatedTodo => {
        const updatedTodos = visibleTodos.map((todo) => {
          if (todo.id === todoToUpdate.id) {
            return {
              ...todoToUpdate,
              completed: updatedTodo.completed,
            };
          }

          return todo;
        });

        setTodosContainer(updatedTodos);
      })
      .catch(() => onError('Unable to update the todo'))
      .finally(() => setProcessed(processed));
  }, [visibleTodos]);

  const onUpdateAllStatus = useCallback(async () => {
    if (visibleTodos.every(t => t.completed)) {
      const updatePromises = visibleTodos.map(todo => {
        return updateTodo(todo.id, { ...todo, completed: false });
      });
      const ids = visibleTodos.map(t => t.id);

      setProcessed([...processed, ...ids]);

      const result = await Promise.all(updatePromises);

      setTodosContainer(result);
      setProcessed(processed);
    } else if (visibleTodos.every(t => !t.completed)) {
      const updatePromises = visibleTodos.map(todo => {
        return updateTodo(todo.id, { ...todo, completed: true });
      });
      const ids = visibleTodos.map(t => t.id);

      setProcessed([...processed, ...ids]);

      const result = await Promise.all(updatePromises);

      setTodosContainer(result);
      setProcessed(processed);
    } else {
      const activeTodos = visibleTodos.filter(todo => !todo.completed);
      const updatePromises = activeTodos.map(todo => {
        return updateTodo(todo.id, { ...todo, completed: true });
      });
      const ids = activeTodos.map(todo => todo.id);

      setProcessed([...processed, ...ids]);

      await Promise.all(updatePromises);

      const updatedTodos = visibleTodos.map((todo) => {
        if (!todo.completed) {
          return {
            ...todo,
            completed: true,
          };
        }

        return todo;
      });

      setTodosContainer(updatedTodos);
      setProcessed(processed);
    }
  }, [visibleTodos]);

  const onUpdateTitle = useCallback((todoToUpdate: Todo, newTitle: string) => {
    setProcessed([...processed, todoToUpdate.id]);

    updateTodo(todoToUpdate.id, { ...todoToUpdate, title: newTitle })
      .then((res) => {
        const updatedTodos = visibleTodos.map(todo => {
          if (todo.id === todoToUpdate.id) {
            return {
              ...todo,
              title: res.title,
            };
          }

          return todo;
        });

        setTodosContainer(updatedTodos);
      })
      .catch(() => onError('Unable to update the todo'))
      .finally(() => setProcessed(processed));
  }, [visibleTodos]);

  const providedValue = useMemo(() => ({
    todos: visibleTodos,
    todosContainer,
    completedTodos,
    errorMessage,
    tempTodo,
    selectedStatus,
    USER_ID,
    processed,
    filterByStatus,
    onError,
    onDeleteCompleted,
    onCreateTodo,
    onUpdateAllStatus,
    onDeleteTodo,
    onUpdateStatus,
    onUpdateTitle,
  }), [
    visibleTodos,
    todosContainer,
    completedTodos,
    errorMessage,
    tempTodo,
    selectedStatus,
    USER_ID,
    processed,
  ]);

  return (
    <TodoContext.Provider value={providedValue}>
      {children}
    </TodoContext.Provider>
  );
};
