import {
  createContext, useContext, useEffect, useState,
} from 'react';
import {
  getTodos, updateTodo, addTodo, deleteTodo, updateTodoTitle,
} from '../api/todos';
import { Filter } from '../types/Filter';
import { Todo } from '../types/Todo';

const USER_ID = Number(process.env.REACT_APP_USER_ID);

type TodosContextType = {
  todos: Todo[],
  title: string,
  tempTodo: Todo | null,
  isLoading: boolean,
  isFocused: boolean,
  isFocusedEditForm: boolean,
  deletedTodosId: number[],
  updatedTodosId: number[],
  editedTodoId: number | null,
  updatedTitle: string,
  activeFilter: Filter,
  error: string,
  isError: boolean,
  hideError: () => void
  handleEscape: () => void,
  updateTitle: (id: number) => void,
  updateTitleHandler: (query: string) => void,
  onSubmit: () => void,
  toggleCompleted: (id: number) => void,
  doubleClickHandler: (id: number) => void,
  handleRemove: (id: number) => void,
  handleToggleAllComplete: () => void,
  handleClearCompleted: () => void,
  handleSelectedFilter: (filter: Filter) => void,
  titleChangeHandler: (query: string) => void,
};

const TodosContext = createContext<TodosContextType | undefined>(undefined);

type Props = React.PropsWithChildren;

export const TodosProvider = ({ children }: Props) => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [activeFilter, setActiveFilter]
  = useState<Filter>(Filter.All);
  const [isError, setIsError] = useState<boolean>(false);
  const [title, setTitle] = useState<string>('');
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [error, setError] = useState<string>('');
  const [deletedTodosId, setDeletedTodosId] = useState<number[]>([]);
  const [updatedTodosId, setUpdatedTodosId] = useState<number[]>([]);
  const [updatedTitle, setUpdatedTitle] = useState<string>('');
  const [editedTodoId, setEditedTodoId] = useState<number | null>(null);
  const [isFocused, setIsFocused] = useState<boolean>(true);
  const [isFocusedEditForm, setIsFocusedEditForm] = useState<boolean>(false);

  // TODOS GET
  useEffect(() => {
    getTodos(USER_ID)
      .then(setTodos)
      .catch(() => {
        setIsError(true);
        setError('Unable to load todos');
        setTimeout(() => setIsError(false), 3000);
      })
      .finally(() => setIsLoading(false));
  }, []);

  // FILTER
  const handleSelectedFilter = (filter: Filter) => {
    setActiveFilter(filter);
  };

  // CHECKBOX COMPLETED TOGGLE

  const toggleCompleted = async (id: number) => {
    const selectedTodo = todos.find(todo => todo.id === id);

    if (!selectedTodo) {
      return;
    }

    const updatedTodo = {
      ...selectedTodo,
      completed: !selectedTodo.completed,
    };

    try {
      setUpdatedTodosId([id]);
      await updateTodo(id, { completed: updatedTodo.completed });
      // eslint-disable-next-line
      const updatedTodos = todos.map(todo => todo.id === id ? updatedTodo : todo);

      setTodos(updatedTodos);
      // eslint-disable-next-line
    } catch (error) {
      setIsError(true);
      setError('Unable to update a todo');
      setTimeout(() => setIsError(false), 3000);
    } finally {
      setUpdatedTodosId([]);
    }
  };

  // ALL COMPLETE HANDLER

  const handleToggleAllComplete = () => {
    const todosToUpdate = todos.some(todo => !todo.completed)
      ? todos.filter(todo => !todo.completed)
      : todos;

    const todosIdList = todosToUpdate.map(todo => todo.id);

    setUpdatedTodosId(todosIdList);

    const updatePromises = todosToUpdate.map(todo =>
      // eslint-disable-next-line
      updateTodo(todo.id, { completed: !todo.completed })
        .then(() => todo.id)
        .catch(() => {
          setIsError(true);
          setError('Unable to update todos');
          setTimeout(() => setIsError(false), 3000);
        }));

    Promise.all(updatePromises)
      .then(toggledIds => {
        const updatedValues = todos.map(todo => {
          return toggledIds.includes(todo.id)
            ? { ...todo, completed: !todo.completed }
            : todo;
        });

        setTodos(updatedValues);
        setUpdatedTodosId([]);
      });
  };

  // UPDATE TITLE

  const titleChangeHandler = (query: string) => {
    setIsError(false);
    setTitle(query.trimStart());
  };

  const updateTitleHandler = (query: string) => {
    setUpdatedTitle(query);
  };

  const doubleClickHandler = (id: number) => {
    const updatedTodo = todos.find(todo => todo.id === id) as Todo;

    setEditedTodoId(id);
    setUpdatedTitle(updatedTodo.title);
    setIsFocused(false);
    setIsFocusedEditForm(true);
  };

  const updateTitle = async (id: number) => {
    const selectedTodo = todos.find(todo => todo.id === id);

    if (!selectedTodo) {
      return;
    }

    if (updatedTitle === '') {
      try {
        setDeletedTodosId([id]);
        await deleteTodo(id);
        const filteredValues = todos.filter(todo => todo.id !== id);

        setTodos(filteredValues);
        // eslint-disable-next-line
      } catch (error) {
        setIsError(true);
        setError('Unable to delete a todo');
        setTimeout(() => setIsError(false), 3000);
      } finally {
        // eslint-disable-next-line
        resetForm();
      }
    } else if (updatedTitle !== selectedTodo.title) {
      try {
        setUpdatedTodosId([id]);
        await updateTodoTitle(id, { title: updatedTitle.trim() });
        // eslint-disable-next-line
        const updatedTodos = todos.map(todo => todo.id === id ? { ...todo, title: updatedTitle } : todo);

        setTodos(updatedTodos);
        // eslint-disable-next-line
      } catch (error) {
        setIsError(true);
        setError('Unable to update a todo');
        setTimeout(() => setIsError(false), 3000);
      } finally {
        // eslint-disable-next-line
        resetForm();
      }
    } else {
      // eslint-disable-next-line
      resetForm();
    }
  };

  const resetForm = () => {
    setUpdatedTodosId([]);
    setUpdatedTitle('');
    setEditedTodoId(null);
    setIsFocused(true);
  };

  const handleEscape = () => {
    setEditedTodoId(null);
    setUpdatedTitle('');
    setIsFocused(true);
  };

  // SUBMITTING

  const onSubmit = () => {
    if (title === '') {
      setIsError(true);
      setError('Title should not be empty');
      setTimeout(() => setIsError(false), 3000);

      return;
    }

    const trimmedTitle = title.trim();
    const temporaryTodo = {
      id: 0,
      title: trimmedTitle,
      userId: USER_ID,
      completed: false,
    };

    setTempTodo(temporaryTodo);

    addTodo({
      title: trimmedTitle,
      userId: USER_ID,
      completed: false,
    })
      .then(response => {
        setTitle('');
        setTodos([...todos, response]);
        setTempTodo(null);
      })
      .catch(() => {
        setTempTodo(null);
        setIsError(true);
        setError('Unable to add a todo');
      })
      .finally(() => {
        setTimeout(() => setIsError(false), 3000);
      });
  };

  // TODO REMOVING

  const handleRemove = (id: number) => {
    const filteredValues = todos.filter(todo => todo.id !== id);
    const deletedValue = todos.find(todo => todo.id === id) as Todo;

    setDeletedTodosId([deletedValue.id]);

    deleteTodo(id)
      .then(() => setTodos(filteredValues))
      .catch(() => {
        setIsError(true);
        setError('Unable to delete a todo');
        setTimeout(() => setIsError(false), 3000);
      })
      .finally(() => {
        setDeletedTodosId([]);
        setTitle('');
      });
  };

  // COMPLETED CLEARING

  const handleClearCompleted = () => {
    const filterCompleted = todos.filter(todo => todo.completed);
    const todosIdList = filterCompleted.map(todo => todo.id);

    setDeletedTodosId(todosIdList);

    const deletePromises = filterCompleted.map(todo =>
      // eslint-disable-next-line
      deleteTodo(todo.id)
        .then(() => todo.id)
        .catch(() => {
          setIsError(true);
          setError('Unable to delete a todo');
          setTimeout(() => setIsError(false), 3000);
        }));

    Promise.all(deletePromises)
      .then(deletedIds => {
        setDeletedTodosId([]);
        const updatedValues = todos.filter(todo =>
        // eslint-disable-next-line
          !deletedIds.includes(todo.id));

        setTodos(updatedValues);
      });
  };

  const hideError = () => {
    setIsError(false);
  };

  return (
    <TodosContext.Provider value={{
      todos,
      title,
      tempTodo,
      isLoading,
      isFocused,
      isFocusedEditForm,
      deletedTodosId,
      updatedTodosId,
      editedTodoId,
      updatedTitle,
      activeFilter,
      error,
      isError,
      hideError,
      handleEscape,
      updateTitle,
      updateTitleHandler,
      onSubmit,
      titleChangeHandler,
      toggleCompleted,
      doubleClickHandler,
      handleRemove,
      handleToggleAllComplete,
      handleClearCompleted,
      handleSelectedFilter,
    }}
    >
      {children}
    </TodosContext.Provider>
  );
};

export const useTodosProvider = (): TodosContextType => {
  const context = useContext(TodosContext);

  if (!context) {
    throw new Error('useTodoProvider must be used within a TodoProvider');
  }

  return context;
};
