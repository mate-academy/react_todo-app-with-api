import { createContext, useEffect, useState } from 'react';
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
  const [todos, setTodos] = useState<Todo[]>([]);
  const [todosContainer, setTodosContainer] = useState<Todo[]>([]);
  const [completedTodos, setCompletedTodos] = useState<Todo[]>([]);
  const [selectedStatus, setSelectedStatus] = useState(TodoStatus.All);
  const [errorMessage, setErrorMessage] = useState('');
  const [processed, setProcessed] = useState<number[]>([]);

  useEffect(() => {
    getTodos(USER_ID)
      .then((res) => {
        setTodos(res);
        setTodosContainer(res);
        setCompletedTodos(res.filter(todo => todo.completed));
      })
      .catch((error) => {
        throw error;
      });
  }, []);

  const filterByStatus = (status: TodoStatus) => {
    const filtered = todosContainer.filter(todo => {
      switch (status) {
        case TodoStatus.Active:
          return !todo.completed;
        case TodoStatus.Completed:
          return todo.completed;
        default:
          return todo;
      }
    });

    setTodos(filtered);
    setSelectedStatus(status);
  };

  const onError = (error: string) => {
    setErrorMessage(error);
  };

  const handleTempTodo = (todo?: Todo) => {
    if (todo) {
      setTempTodo(todo);
    } else {
      setTempTodo(null);
    }
  };

  const onCreateTodo = (newTodo: Omit<Todo, 'id'>) => {
    handleTempTodo({ ...newTodo, id: 0 });
    createTodo(newTodo).then((res) => {
      setTodosContainer([...todosContainer, res]);
      setTodos([...todosContainer, res]);
    }).catch(() => {
      onError('Unable to add a todo');
      handleTempTodo();
    })
      .finally(() => {
        handleTempTodo();
      });
  };

  const onDeleteTodo = (todoId: number) => {
    setProcessed([...processed, todoId]);
    deleteTodo(todoId)
      .then(() => {
        setTodosContainer(todosContainer.filter(todo => todo.id !== todoId));
        setTodos(todos.filter(todo => todo.id !== todoId));
        setCompletedTodos(todos.filter(todo => todo.id !== todoId));
      })
      .catch(() => onError('Unable to delete the todo'))
      .finally(() => setProcessed(processed));
  };

  const onDeleteCompleted = async () => {
    const deletePromises = completedTodos.map(todo => deleteTodo(todo.id));

    try {
      const ids = completedTodos.map(todo => todo.id);

      setProcessed([...processed, ...ids]);

      await Promise.all(deletePromises);
      setTodos(todos.filter(todo => !todo.completed));
      setTodosContainer(todosContainer.filter(todo => !todo.completed));
      setCompletedTodos([]);
    } catch (error) {
      onError('Unable to delete the todo');
    } finally {
      setProcessed(processed);
    }
  };

  const onUpdateStatus = (todoToUpdate: Todo) => {
    const newStatus = !todoToUpdate.completed;

    setProcessed([...processed, todoToUpdate.id]);
    updateTodo(todoToUpdate.id, { ...todoToUpdate, completed: newStatus })
      .then(updatedTodo => {
        const updatedTodos = todos.map((todo) => {
          if (todo.id === todoToUpdate.id) {
            return {
              ...todoToUpdate,
              completed: updatedTodo.completed,
            };
          }

          return todo;
        });

        if (updatedTodo.completed) {
          setCompletedTodos(
            completedTodos.map(todo => {
              if (todo.id === todoToUpdate.id) {
                return {
                  ...todo,
                  completed: updatedTodo.completed,
                };
              }

              return todo;
            }),
          );
        } else {
          setCompletedTodos(completedTodos
            .filter(({ id }) => id !== todoToUpdate.id));
        }

        setTodos(updatedTodos);
        setTodosContainer(updatedTodos);
      })
      .catch(() => onError('Unable to update the todo'))
      .finally(() => setProcessed(processed));
  };

  const onUpdateAllStatus = async () => {
    if (todos.every(t => t.completed)) {
      const updatePromises = todos.map(todo => {
        return updateTodo(todo.id, { ...todo, completed: false });
      });
      const ids = todos.map(t => t.id);

      setProcessed([...processed, ...ids]);

      const result = await Promise.all(updatePromises);

      setTodos(result);
      setTodosContainer(result);
      setCompletedTodos([]);
      setProcessed(processed);
    } else if (todos.every(t => !t.completed)) {
      const updatePromises = todos.map(todo => {
        return updateTodo(todo.id, { ...todo, completed: true });
      });
      const ids = todos.map(t => t.id);

      setProcessed([...processed, ...ids]);

      const result = await Promise.all(updatePromises);

      setTodos(result);
      setTodosContainer(result);
      setCompletedTodos(result);
      setProcessed(processed);
    } else {
      const activeTodos = todos.filter(todo => !todo.completed);
      const updatePromises = activeTodos.map(todo => {
        return updateTodo(todo.id, { ...todo, completed: true });
      });
      const ids = activeTodos.map(todo => todo.id);

      setProcessed([...processed, ...ids]);

      await Promise.all(updatePromises);

      const updatedTodos = todos.map((todo) => {
        if (!todo.completed) {
          return {
            ...todo,
            completed: true,
          };
        }

        return todo;
      });

      setTodos(updatedTodos);
      setTodosContainer(updatedTodos);
      setCompletedTodos(updatedTodos);
      setProcessed(processed);
    }
  };

  const onUpdateTitle = (todoToUpdate: Todo, newTitle: string) => {
    setProcessed([...processed, todoToUpdate.id]);

    updateTodo(todoToUpdate.id, { ...todoToUpdate, title: newTitle })
      .then((res) => {
        const updatedTodos = todos.map(todo => {
          if (todo.id === todoToUpdate.id) {
            return {
              ...todo,
              title: res.title,
            };
          }

          return todo;
        });

        if (todoToUpdate.completed) {
          setCompletedTodos(completedTodos.map(todo => {
            if (todo.id === todoToUpdate.id) {
              return {
                ...todo,
                title: res.title,
              };
            }

            return todo;
          }));
        }

        setTodos(updatedTodos);
        setTodosContainer(updatedTodos);
      })
      .catch(() => onError('Unable to update the todo'))
      .finally(() => setProcessed(processed));
  };

  const providedValue = {
    todos,
    tempTodo,
    todosContainer,
    completedTodos,
    selectedStatus,
    errorMessage,
    processed,
    USER_ID,
    filterByStatus,
    onCreateTodo,
    onError,
    onDeleteTodo,
    onDeleteCompleted,
    onUpdateStatus,
    onUpdateAllStatus,
    onUpdateTitle,
  };

  return (
    <TodoContext.Provider value={providedValue}>
      {children}
    </TodoContext.Provider>
  );
};
