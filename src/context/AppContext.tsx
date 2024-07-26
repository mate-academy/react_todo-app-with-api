import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import { Todo } from '../types/Todo';
import { SortType } from '../enums/SortType';
import {
  deleteTodo,
  editTodo,
  editTodoCheck,
  getTodos,
  postTodo,
  USER_ID,
} from '../api/todos';

type AppContextContainerProps = {
  addTodo: (value: string) => void;
  dltTodo: (id: number) => void;
  error: string;
  handleClickCloseError: () => void;
  filterType: SortType;
  changeFilterType: (newType: SortType) => void;
  inputRef: React.RefObject<HTMLInputElement>;
  tempTodo: Todo | null;
  todos: Todo[] | null;
  ckickEsc: (id: number, prevTitle: string) => void;
  changeTitle: (id: number, value: string) => void;
  changeEdited: (todo: Todo) => void;
  deleteCompleted: () => Promise<void>;
  switchTodoCompleted: (todo: Todo) => void;
  toggleAllActive: () => void;
  toggleAllCompleted: () => void;
  switchEdited: (todo: Todo) => void;
  queryText: string;
  handleChangeQueryText: (text: string) => void;
};

type Props = {
  children: ReactNode;
};

const AppContextContainer = createContext({} as AppContextContainerProps);

export const useAppContextContainer = () => {
  const context = useContext(AppContextContainer);

  if (context === undefined) {
    throw new Error(
      'Context must be used within an AppContextContainerProvider',
    );
  }

  return context;
};

export const AppContext = ({ children }: Props) => {
  const [todos, setTodos] = useState<Todo[] | null>(null);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [filterType, setFilterType] = useState<SortType>(SortType.ALL);
  const [error, setError] = useState<string>('');
  const inputRef = useRef<HTMLInputElement>(null);
  const [queryText, setQueryText] = useState<string>('');

  const changeFilterType = (newType: SortType) => setFilterType(newType);

  const handleClickCloseError = () => setError('');

  const handleChangeQueryText = (text: string) => setQueryText(text);

  const addTodo = (value: string) => {
    if (!value.length || !value.trim().length) {
      return setError(`Title should not be empty`);
    }

    if (inputRef.current !== null) {
      inputRef.current.disabled = true;
    }

    setTempTodo({
      id: 0,
      title: value.trim(),
      completed: false,
      userId: USER_ID,
      isEdited: false,
      loaded: true,
    });

    return postTodo(value.trim())
      .then(data => {
        setTodos(prev => {
          if (prev) {
            return [...prev, { ...data, loaded: false, isEdited: false }];
          }

          return prev;
        });
        setTempTodo(null);
        setQueryText('');
        if (inputRef.current !== null) {
          inputRef.current.disabled = false;
          inputRef.current.focus();
        }
      })
      .catch(() => {
        setError('Unable to add a todo');
        setTempTodo(null);
        if (inputRef.current !== null) {
          inputRef.current.disabled = false;
          inputRef.current.focus();
        }
      });
  };

  const dltTodo = async (id: number) => {
    setTodos(prev => {
      if (prev) {
        return prev.map(el => {
          if (el.id == id) {
            return { ...el, loaded: true };
          }

          return el;
        });
      }

      return prev;
    });

    try {
      await deleteTodo(id);
      setTodos(prev => {
        if (prev) {
          return prev.filter(el => el.id !== id);
        }

        return prev;
      });
      inputRef.current?.focus();
    } catch {
      return setError(`Unable to delete a todo`);
    }
  };

  const deleteCompleted = async () => {
    const completedTodo = todos?.filter(todo => todo.completed);

    setTodos(prev => {
      if (prev) {
        return prev.map(todo => {
          if (todo.completed) {
            return { ...todo, loaded: true };
          }

          return todo;
        });
      }

      return prev;
    });

    const deletePromises = completedTodo?.map(todo =>
      deleteTodo(todo.id)
        .then(() => ({ status: 'fulfilled', id: todo.id }))
        .catch(errorTodo => ({ status: 'rejected', id: todo.id, errorTodo })),
    );

    if (deletePromises) {
      const results = await Promise.all(deletePromises);

      const successfulDeletions = results
        .filter(result => result.status === 'fulfilled')
        .map(result => result.id);

      const failedDeletions = results
        .filter(result => result.status === 'rejected')
        .map(result => result.id);

      if (failedDeletions.length > 0) {
        setError('Unable to delete a todo');
      }

      setTodos(prev => {
        if (prev) {
          return prev?.filter(todo => !successfulDeletions.includes(todo.id));
        }

        return prev;
      });

      inputRef.current?.focus();
    }
  };

  const switchTodoCompleted = (todo: Todo) => {
    setTodos(prev => {
      if (prev) {
        return prev.map(el => {
          if (el.id == todo.id) {
            return { ...el, loaded: true };
          }

          return el;
        });
      }

      return prev;
    });

    editTodoCheck(todo.id, !todo.completed)
      .then(() => {
        setTodos(prev => {
          if (prev) {
            return prev.map(el => {
              if (el.id === todo.id) {
                return { ...el, completed: !todo.completed, loaded: false };
              }

              return el;
            });
          }

          return prev;
        });
      })
      .catch(() => {
        setError(`Unable to update a todo`);
        setTodos(prev => {
          if (prev) {
            return prev.map(el => {
              if (el.id === todo.id) {
                return { ...el, loaded: false };
              }

              return el;
            });
          }

          return prev;
        });
      });
  };

  const toggleAllCompleted = () => {
    setTodos(prev => {
      if (prev) {
        return prev.map(todo => {
          if (todo) {
            return { ...todo, loaded: true };
          }

          return todo;
        });
      }

      return prev;
    });

    if (todos) {
      todos.map(todo => {
        editTodoCheck(todo.id, true)
          .then(() => {
            setTodos(prev => {
              if (prev) {
                return prev.map(el => ({
                  ...el,
                  completed: true,
                  loaded: false,
                }));
              }

              return prev;
            });
          })
          .catch(() => setError(`Unable to update a todo`));
      });
    }
  };

  const toggleAllActive = () => {
    setTodos(prev => {
      if (prev) {
        return prev.map(todo => {
          if (todo) {
            return { ...todo, loaded: true };
          }

          return todo;
        });
      }

      return prev;
    });

    if (todos) {
      todos.map(todo => {
        editTodoCheck(todo.id, false)
          .then(() => {
            setTodos(prev => {
              if (prev) {
                return prev.map(el => ({
                  ...el,
                  completed: false,
                  loaded: false,
                }));
              }

              return prev;
            });
          })
          .catch(() => setError(`Unable to update a todo`));
      });
    }
  };

  const changeTitle = (id: number, value: string) => {
    setTodos(prev => {
      if (prev) {
        return prev.map(el => {
          if (id === el.id) {
            return { ...el, title: value };
          }

          return el;
        });
      }

      return prev;
    });
  };

  const switchEdited = (todo: Todo) => {
    setTodos(prev => {
      if (prev) {
        return prev.map(swTodo => {
          if (swTodo.id === todo.id) {
            return { ...swTodo, loaded: true };
          }

          return swTodo;
        });
      }

      return prev;
    });

    editTodo({ ...todo, title: todo.title.trim() })
      .then(req => {
        setTodos(prev => {
          if (prev) {
            return prev.map(el => {
              if (todo.id === el.id) {
                return { ...req, loaded: false };
              }

              return el;
            });
          }

          return prev;
        });
      })
      .catch(() => setError('XXX'));
  };

  const changeEdited = (todo: Todo) => {
    setTodos(prev => {
      if (prev) {
        return prev.map(edTodo => {
          if (edTodo.id === todo.id) {
            return { ...edTodo, isEdited: true };
          }

          return edTodo;
        });
      }

      return prev;
    });
  };

  const ckickEsc = (id: number, prevTitle: string) => {
    setTodos(prev => {
      if (prev) {
        return prev.map(el => {
          if (id === el.id) {
            return { ...el, title: prevTitle, isEdited: false };
          }

          return el;
        });
      }

      return prev;
    });
  };

  useEffect(() => {
    inputRef.current?.focus();
    getTodos()
      .then(data =>
        setTodos(
          data.map(todo => ({ ...todo, isEdited: false, loaded: false })),
        ),
      )
      .catch(() => setError(`Unable to load todos`));
  }, []);

  useEffect(() => {
    if (error.length) {
      setTimeout(() => {
        setError('');
      }, 3000);
    }
  }, [error]);

  return (
    <AppContextContainer.Provider
      value={{
        addTodo,
        dltTodo,
        error,
        handleClickCloseError,
        switchEdited,
        filterType,
        changeFilterType,
        inputRef,
        todos,
        ckickEsc,
        changeEdited,
        changeTitle,
        deleteCompleted,
        switchTodoCompleted,
        toggleAllActive,
        toggleAllCompleted,
        tempTodo,
        queryText,
        handleChangeQueryText,
      }}
    >
      {children}
    </AppContextContainer.Provider>
  );
};
