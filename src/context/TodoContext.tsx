import {
  FormEventHandler,
  createContext, useContext, useEffect, useState,
} from 'react';
import {
  Errors, Props, TodoContextType,
} from './types';
import {
  deleteTodo, editTodo, getTodos, postTodo,
} from '../api/todos';
import { Todo } from '../types/Todo';
import { FilterType } from '../types/FilterType';

const TodoContext = createContext<TodoContextType | undefined>(undefined);
const USER_ID = 11433;

export const ToDoProvider = ({ children }: Props) => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [error, setError] = useState<Errors | null>(null);
  const [filterTodos, setFilterTodos]
    = useState<FilterType>('all');
  const [newTodo, setNewTodo] = useState<string>('');
  const [temptTodo, setTempTodo] = useState<Todo | null>(null);
  const [temptTodos, setTempTodos] = useState<Todo[]>([]);
  const [editedTodo, setEditedTodo] = useState<boolean>(false);
  const [newTitle, setNewTitle] = useState<string>('');
  const [isFocusedOnTask, setIsFocusedOnTask] = useState<boolean>(false);

  const handleShowError = (err: Errors) => {
    setError(err);
    setTimeout(() => {
      setError(null);
    }, 3000);
  };

  const handleGetTodos = async () => {
    const data = await getTodos(USER_ID);

    setTodos(data);
  };

  useEffect(() => {
    handleGetTodos()
      .catch(() => {
        handleShowError(Errors.Download);
      });
  }, []);

  const handleSetFilterTodos = (filterType: FilterType) => {
    setFilterTodos(filterType);
  };

  const closeErrorMessage = () => {
    setError(null);
  };

  const addNewTodo: FormEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault();
    if (newTodo.trim() === '') {
      handleShowError(Errors.Title);
    } else {
      const todoToAdd: Todo = {
        id: +(new Date()),
        userId: 11433,
        title: newTodo.trim(),
        completed: false,
      };

      setTempTodos([...temptTodos, todoToAdd]);
      setTempTodo(todoToAdd);
      postTodo({
        userId: 11433,
        title: newTodo.trim(),
        completed: false,
      })
        .then((response) => {
          const addedTodo = response;

          setTodos((prevTodos) => [...prevTodos, addedTodo]);
        })
        .then(() => setNewTodo(''))
        .catch(() => handleShowError(Errors.Add))
        .finally(() => setTempTodo(null))
        .then(() => setTempTodos([]));
    }
  };

  const removeTask = (task: Todo) => {
    setTempTodo(task);
    deleteTodo(task.id)
      .then(() => {
        setTodos(prevState => prevState.filter(t => t.id !== task.id));
      })
      .catch(() => handleShowError(Errors.Delete))
      .finally(() => setTempTodo(null));
  };

  const deleteCompleted = (tasks: Todo[]) => {
    setEditedTodo(true);

    tasks.forEach(task => (
      removeTask(task)));
  };

  const allTodosAreActive = todos.every(t => !t.completed);

  const allTodosCompleted = todos.every(t => t.completed);

  const toggleCompletedTodos = (task: Todo) => {
    setTodos(prevState => prevState.map(t => {
      if (t.id === task.id) {
        return {
          ...t,
          hasLoader: true,
        };
      }

      return t;
    }));

    editTodo(task.id, { completed: !task.completed })
      .then(() => {
        setTodos(prevState => prevState.map(t => {
          if (t.id === task.id) {
            return {
              ...t,
              completed: !task.completed,
              hasLoader: false,
            };
          }

          return t;
        }));
      })
      .catch(() => handleShowError(Errors.Update))
      .then(() => {
        setTodos(prevState => prevState.map(t => {
          if (t.id === task.id) {
            return {
              ...t,
              hasLoader: false,
            };
          }

          return t;
        }));
      });
  };

  const toggleActiveTodo = (tasks: Todo[]) => {
    if (allTodosAreActive) {
      tasks.forEach(t => toggleCompletedTodos(t));
    }

    if (allTodosCompleted) {
      tasks.forEach(t => toggleCompletedTodos(t));
    }

    tasks.forEach(t => {
      if (!t.completed) {
        toggleCompletedTodos(t);
      }
    });
  };

  const onTitleEdition = (tasks: Todo[], taskId: number) => {
    setIsFocusedOnTask(true);
    setTodos(
      tasks.map((t) => {
        if (t.id === taskId) {
          setNewTitle(t.title);

          return {
            ...t,
            isOnTitleEdition: true,
          };
        }

        return t;
      }),
    );
  };

  const closeTitleEdition = (tasks: Todo[], taskId: number) => {
    setIsFocusedOnTask(false);
    setTodos(
      tasks.map((t) => {
        if (t.id === taskId) {
          return {
            ...t,
            isOnTitleEdition: false,
          };
        }

        return t;
      }),
    );
  };

  const todoTitleEdition = (
    task: Todo,
    updatedTitle: string,
    tasks: Todo[],
  ) => {
    if (updatedTitle === '') {
      removeTask(task);
    } else {
      const updatedTodos = tasks.map((t) => {
        if (t.id === task.id) {
          setTempTodo(t);

          return {
            ...t,
            title: updatedTitle.trim(),
          };
        }

        return t;
      });

      editTodo(task.id, { title: updatedTitle })
        .then(() => {
          setTodos(updatedTodos);
        })
        .then(() => {
          closeTitleEdition(updatedTodos, task.id);
        })
        .catch(() => {
          handleShowError(Errors.Update);
        })
        .finally(() => setTempTodo(null));
    }
  };

  return (
    <TodoContext.Provider value={{
      todos,
      error,
      filterTodos,
      newTodo,
      temptTodo,
      editedTodo,
      temptTodos,
      newTitle,
      allTodosAreActive,
      allTodosCompleted,
      isFocusedOnTask,
      setNewTodo,
      handleShowError,
      handleSetFilterTodos,
      closeErrorMessage,
      addNewTodo,
      removeTask,
      deleteCompleted,
      toggleActiveTodo,
      toggleCompletedTodos,
      todoTitleEdition,
      onTitleEdition,
      closeTitleEdition,
      setNewTitle,
    }}
    >
      {children}
    </TodoContext.Provider>
  );
};

export const useTodo = (): TodoContextType => {
  const context = useContext(TodoContext);

  if (!context) {
    throw new Error('useTodo must be used within a ToDoProvider');
  }

  return context;
};
