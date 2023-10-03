import {
  createContext, useContext, useEffect, useState,
} from 'react';
import {
  getTodos, updateTodo, addTodo, deleteTodo, updateTodoTitle,
} from '../api/todos';
import { Filter } from '../types/Filter';
import { Todo } from '../types/Todo';

const USER_ID = 11547;

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
  handleDoubleClick: (id: number) => void,
  handleRemove: (id: number) => void,
  handleToggleAllComplete: () => void,
  handleClearCompleted: () => void,
  handleSelectedFilter: (filter: Filter) => void,
  handleTitleChange: (query: string) => void,
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

  // GET TODOS
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

  // COMPLETED CHECKBOX
  const toggleCompleted = (id: number) => {
    const selectedTodo = todos.find(todo => todo.id === id);

    if (selectedTodo) {
      setUpdatedTodosId([id]);

      updateTodo(id, {
        completed: !selectedTodo.completed,
      })
        .then(() => {
          const updatedTodos = todos.map(todo => {
            if (todo.id === id) {
              return {
                ...todo,
                completed: !selectedTodo.completed,
              };
            }

            return todo;
          });

          setTodos(updatedTodos);
        })
        .catch(() => {
          setIsError(true);
          setError('Unable to update a todo');
          setTimeout(() => {
            setIsError(false);
          }, 3000);
        })
        .finally(() => setUpdatedTodosId([]));
    }
  };

  const handleToggleAllComplete = () => {
    if (todos.some(todo => !todo.completed)) {
      const filterNotCompleted = todos.filter(todo => !todo.completed);
      const todosIdList = filterNotCompleted.map(todo => todo.id);
      const toggledValues: number[] = [];

      setUpdatedTodosId(todosIdList);

      for (let i = 0; i < filterNotCompleted.length; i += 1) {
        updateTodo(filterNotCompleted[i].id, {
          completed: !filterNotCompleted[i].completed,
        })
          .then(() => {
            toggledValues.push(filterNotCompleted[i].id);
          })
          .catch(() => {
            setIsError(true);
            setError('Unable to update todos');
            setTimeout(() => setIsError(false), 3000);
          })
          .finally(() => {
            const updatedValues = todos.map(todo => {
              if (!toggledValues.includes(todo.id)) {
                return todo;
              }

              return {
                ...todo,
                completed: !todo.completed,
              };
            });

            setTodos(updatedValues);
            setUpdatedTodosId([]);
          });
      }
    } else {
      const toggledValues: number[] = [];
      const todosIdList = todos.map(todo => todo.id);

      setUpdatedTodosId(todosIdList);

      for (let i = 0; i < todos.length; i += 1) {
        updateTodo(todos[i].id, {
          completed: !todos[i].completed,
        })
          .then(() => {
            toggledValues.push(todos[i].id);
          })
          .catch(() => {
            setIsError(true);
            setError('Unable to update todos');
            setTimeout(() => setIsError(false), 3000);
          })
          .finally(() => {
            const updatedValues = todos.map(todo => {
              return {
                ...todo,
                completed: !todo.completed,
              };
            });

            setTodos(updatedValues);
            setUpdatedTodosId([]);
          });
      }
    }
  };

  // TITLE UPDATE
  const handleTitleChange = (query: string) => {
    setIsError(false);
    setTitle(query.trimStart());
  };

  const updateTitleHandler = (query: string) => {
    setUpdatedTitle(query);
  };

  const handleDoubleClick = (id: number) => {
    const updatedTodo = todos.find(todo => todo.id === id) as Todo;

    setEditedTodoId(id);
    setUpdatedTitle(updatedTodo.title);
    setIsFocused(false);
    setIsFocusedEditForm(true);
  };

  const updateTitle = (id: number) => {
    if (updatedTitle === '') {
      setDeletedTodosId([id]);
      deleteTodo(id)
        .then(() => {
          const filteredValues = todos.filter(todo => todo.id !== id);

          setTodos(filteredValues);
        })
        .catch(() => {
          setIsError(true);
          setError('Unable to delete a todo');
          setTimeout(() => setIsError(false), 3000);
        })
        .finally(() => {
          setDeletedTodosId([]);
          setEditedTodoId(null);
          setUpdatedTitle('');
          setIsFocused(true);
        });
    }

    if (updatedTitle === todos.find(todo => todo.id === id)?.title) {
      setEditedTodoId(null);
    }

    if (updatedTitle !== '') {
      setUpdatedTodosId([id]);
      updateTodoTitle(id, {
        title: updatedTitle.trim(),
      })
        .then(() => {
          const updatedTodos = todos.map(todo => {
            if (todo.id === id) {
              return {
                ...todo,
                title: updatedTitle,
              };
            }

            return todo;
          });

          setTodos(updatedTodos);
        })
        .catch(() => {
          setIsError(true);
          setError('Unable to update a todo');
          setTimeout(() => {
            setIsError(false);
          }, 3000);
        })
        .finally(() => {
          setIsFocused(true);
          setUpdatedTodosId([]);
          setUpdatedTitle('');
          setEditedTodoId(null);
        });
    }
  };

  const handleEscape = () => {
    setEditedTodoId(null);
    setUpdatedTitle('');
    setIsFocused(true);
  };

  // ADD NEW TODO
  const onSubmit = () => {
    if (title === '') {
      setIsError(true);
      setError('Title should not be empty');
      setTimeout(() => {
        setIsError(false);
      }, 3000);
    }

    if (title !== '') {
      const temporaryTodo = {
        id: 0,
        title: title.trim(),
        userId: USER_ID,
        completed: false,
      };

      setTempTodo(temporaryTodo);

      addTodo({
        title: title.trim(),
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
          setTimeout(() => {
            setIsError(false);
          }, 3000);
        });
    }
  };

  // DELETE TODO
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

  // DELETE COMPLETED
  const handleClearCompleted = () => {
    const filterCompleted = todos.filter(todo => todo.completed);
    const deletedTodos: number[] = [];
    const todosIdList = filterCompleted.map(todo => todo.id);

    setDeletedTodosId(todosIdList);

    for (let i = 0; i < filterCompleted.length; i += 1) {
      deleteTodo(filterCompleted[i].id)
        .then(() => {
          deletedTodos.push(filterCompleted[i].id);
        })
        .catch(() => {
          setIsError(true);
          setError('Unable to delete a todo');
          setTimeout(() => setIsError(false), 3000);
        })
        .finally(() => {
          setDeletedTodosId([]);
          const updatedValues = todos
            .filter(todo => !deletedTodos.includes(todo.id));

          setTodos(updatedValues);
        });
    }
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
      handleTitleChange,
      toggleCompleted,
      handleDoubleClick,
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
