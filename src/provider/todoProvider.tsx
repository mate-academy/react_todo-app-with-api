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
  const [newTodoName, setNewTodoName] = useState<string>('');
  const [temptTodo, setTempTodo] = useState<Todo | null>(null);
  const [temptTodos, setTempTodos] = useState<Todo[]>([]);
  const [editedTodo, setEditedTodo] = useState<boolean>(false);
  const [titleEdition, setTitleEdition] = useState<boolean>(false);
  const [newTitle, setNewTitle] = useState<string>('null');

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
        handleShowError(Errors.Update);
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
    if (newTodoName.trim() === '') {
      handleShowError(Errors.Title);
    } else {
      const todoToAdd: Todo = {
        id: +(new Date()),
        userId: 11433,
        title: newTodoName.trim(),
        completed: false,
      };

      setTempTodos([...temptTodos, todoToAdd]);
      setTempTodo(todoToAdd);
      postTodo({
        userId: 11433,
        title: newTodoName.trim(),
        completed: false,
      })
        .then((response) => {
          const addedTodo = response;

          setTodos((prevTodos) => [...prevTodos, addedTodo]);
          setTempTodo(addedTodo);
          setNewTodoName('');
        })
        .catch(() => handleShowError(Errors.Title))
        .finally(() => setTempTodo(null))
        .then(() => setTempTodos([]));

      setNewTodoName('');
    }
  };

  const removeTask = (task: Todo) => {
    setTempTodo(task);
    deleteTodo(task.id)
      .then(() => handleGetTodos())
      .catch(() => handleShowError(Errors.Delete))
      .finally(() => setTempTodo(null));
  };

  const deleteCompleted = (tasks: Todo[]) => {
    tasks.forEach((t) => {
      setEditedTodo(true);

      return deleteTodo(t.id)
        .then(() => handleGetTodos())
        .catch(() => handleShowError(Errors.Delete))
        .finally(() => setTempTodo(null))
        .then(() => setEditedTodo(false));
    });
  };

  const allTodosAreActive = todos.every(t => !t.completed);
  const toggleActiveTodo = (tasks: Todo[]) => {
    const updatedTodos = todos.map(x => {
      if (!x.completed) {
        return { ...x, isEdited: true };
      }

      return x;
    });

    setTodos(() => updatedTodos);

    tasks.forEach((t) => {
      if (todos.every((v) => v.completed)) {
        const allTodosCompleted = todos.map((x) => {
          if (x.completed) {
            return { ...x, loaderAfterEditing: true };
          }

          return x;
        });

        setTodos(() => allTodosCompleted);
        editTodo(t.id, { completed: false })
          .then(handleGetTodos)
          .catch(() => handleShowError(Errors.Update));
      }

      if (!t.completed) {
        editTodo(t.id, { completed: true })
          .then(() => handleGetTodos())
          .catch(() => handleShowError(Errors.Update));
      }
    });
  };

  const toggleCompletedTodos = (task: Todo) => {
    setTempTodo(task);

    editTodo(task.id, { completed: !task.completed })
      .then(handleGetTodos)
      .catch(() => handleShowError(Errors.Update))
      .finally(() => setTempTodo(null));
  };

  const onTitleEdition = (tasks: Todo[], taskId: number) => {
    setTitleEdition(true);
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

  const todoTitleEdition = (
    task: Todo,
    updatedTitle: string,
    tasks: Todo[],
  ) => {
    if (updatedTitle === task.title) {
      setTitleEdition(false);
    } else if (updatedTitle === '') {
      setTitleEdition(false);
      removeTask(task);
    } else {
      setTodos(
        tasks.map((t) => {
          if (t.id === task.id) {
            return {
              ...t,
              title: updatedTitle,
              loaderAfterEditing: true,
            };
          }

          return t;
        }),
      );
      editTodo(task.id, { title: updatedTitle })
        .then(() => {
          handleGetTodos();
        })
        .catch(() => {
          handleShowError(Errors.Update);
        })
        .finally(() => {
          setTitleEdition(false);
        });
    }
  };

  return (
    <TodoContext.Provider value={{
      todos,
      error,
      filterTodos,
      newTodoName,
      temptTodo,
      editedTodo,
      temptTodos,
      newTitle,
      allTodosAreActive,
      titleEdition,
      setNewTodoName,
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
      setNewTitle,
      setTitleEdition,
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
