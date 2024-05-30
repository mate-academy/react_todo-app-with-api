import React, { FormEvent, useEffect, useRef, useState } from 'react';
import { Todo } from './types/Todo';
import { USER_ID } from './api/todos';
import * as todoServices from './api/todos';
import { FilterField } from './utils/constants';

type ContextProps = {
  readyTodos: Todo[];
  todos: Todo[];
  setTodos: (todos: Todo[]) => void;
  title: string;
  setTitle: (title: string) => void;
  handleSubmit: (event: FormEvent) => void;
  handleCompletedStatus: (todo: Todo) => void;
  handleAllCompleted: () => void;
  errorMessage: string;
  setErrorMessage: (message: string) => void;
  filterField: string;
  setFilterField: (field: string) => void;
  titleField: React.MutableRefObject<HTMLInputElement | null> | null;
  editingTitleField: React.MutableRefObject<HTMLInputElement | null> | null;
  handleDelete: (todo: Todo) => void;
  handleDeleteCompleted: () => void;
  isLoading: boolean;
  isDeletion: boolean;
  currentTodoId: number | null;
  tempTodo: Todo | null;
  selectedTodo: Todo | null;
  setSelectedTodo: (todo: Todo | null) => void;
  editedTitle: string;
  setEditedTitle: (newTitle: string) => void;
  wasEdited: boolean;
  setWasEdited: (wasEdited: boolean) => void;
};

export const TodoContext = React.createContext<ContextProps>({
  readyTodos: [],
  todos: [],
  setTodos: () => {},
  title: '',
  setTitle: () => {},
  handleSubmit: () => {},
  handleCompletedStatus: () => {},
  handleAllCompleted: () => {},
  errorMessage: '',
  setErrorMessage: () => {},
  filterField: '',
  setFilterField: () => {},
  titleField: null,
  editingTitleField: null,
  handleDelete: () => {},
  handleDeleteCompleted: () => {},
  isLoading: false,
  isDeletion: false,
  tempTodo: null,
  currentTodoId: null,
  selectedTodo: null,
  setSelectedTodo: () => {},
  editedTitle: '',
  setEditedTitle: () => {},
  wasEdited: false,
  setWasEdited: () => {},
});

type Props = {
  children: React.ReactNode;
};

export const TodoProvider: React.FC<Props> = ({ children }) => {
  function preparedTodos(todos: Todo[], filterField: string) {
    const readyTodos = [...todos];

    if (filterField) {
      switch (filterField) {
        case FilterField.ALL:
          return readyTodos;

        case FilterField.ACTIVE:
          return readyTodos.filter(todo => !todo.completed);

        case FilterField.COMPLETED:
          return readyTodos.filter(todo => todo.completed);

        default:
          return readyTodos;
      }
    }

    return readyTodos;
  }

  const [todos, setTodos] = useState<Todo[]>([]);
  const [title, setTitle] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [filterField, setFilterField] = useState('all');
  const [isLoading, setIsLoading] = useState(false);
  const [isDeletion, setIsDeletion] = useState(false);
  const [currentTodoId, setCurrentTodoId] = useState<number | null>(null);
  const [selectedTodo, setSelectedTodo] = useState<Todo | null>(null);
  const [editedTitle, setEditedTitle] = useState('');
  const [wasEdited, setWasEdited] = useState(false);

  useEffect(() => {
    todoServices
      .getTodos()
      .then(setTodos)
      .catch(() => {
        setErrorMessage('Unable to load todos');
        setTimeout(() => {
          setErrorMessage('');
        }, 3000);
      });
  }, []);

  const readyTodos = preparedTodos(todos, filterField);

  const titleField = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (titleField.current) {
      titleField.current.focus();
    }
  }, [todos]);

  const editingTitleField = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (editingTitleField.current) {
      editingTitleField.current.focus();
    }
  }, [selectedTodo]);

  const handleCompletedStatus = (currentTodo: Todo) => {
    setCurrentTodoId(currentTodo.id);
    setIsLoading(true);

    todoServices
      .updateTodo(currentTodo)
      .then(() => {
        setTodos(
          todos.map(todo => {
            if (todo.id === currentTodo.id) {
              return { ...todo, completed: !todo.completed };
            }

            return todo;
          }),
        );
      })
      .catch(() => {
        setErrorMessage('Unable to update a todo');

        setTimeout(() => {
          if (titleField.current) {
            titleField.current.focus();
          }

          setErrorMessage('');
        }, 3000);
      })
      .finally(() => {
        setCurrentTodoId(null);
        setIsLoading(false);
      });
  };

  const handleAllCompleted = () => {
    if (todos.every(t => t.completed)) {
      todos.map(todo => {
        setCurrentTodoId(todo.id);
        setIsLoading(true);

        todoServices
          .updateTodo(todo)
          .then(() => {
            setTodos(
              todos.map(t => {
                return { ...t, completed: false };
              }),
            );
          })
          .catch(() => {
            setErrorMessage('Unable to update a todo');

            setTimeout(() => {
              setErrorMessage('');
            }, 3000);
          })
          .finally(() => {
            setCurrentTodoId(null);
            setIsLoading(false);
          });
      });
    } else {
      [...todos.filter(todo => !todo.completed)].map(todo => {
        todoServices
          .updateTodo(todo)
          .then(() => {
            setTodos(
              todos.map(t => {
                return { ...t, completed: true };
              }),
            );
          })
          .catch(() => {
            setErrorMessage('Unable to update a todo');

            setTimeout(() => {
              setErrorMessage('');
            }, 3000);
          })
          .finally(() => {
            setCurrentTodoId(null);
            setIsLoading(false);
          });
      });
    }
  };

  const addTodo = (newTodo: Todo) => {
    setIsLoading(true);

    todoServices
      .createTodo(newTodo)
      .then(todo => {
        setTodos([...todos, todo]);
        setTitle('');
      })
      .catch(() => {
        setErrorMessage('Unable to add a todo');

        setTimeout(() => {
          if (titleField.current) {
            titleField.current.focus();
          }

          setErrorMessage('');
        }, 3000);
      })
      .finally(() => {
        setIsLoading(false);
        setTempTodo(null);
      });
  };

  const updateTodo = (updatedTodo: Todo) => {
    setCurrentTodoId(updatedTodo.id);
    setIsLoading(true);

    todoServices
      .updateTodo(updatedTodo)
      .then(() => {
        setTodos(currentTodos => {
          const newTodos = [...currentTodos];
          const index = newTodos.findIndex(todo => todo.id === updatedTodo.id);

          newTodos.splice(index, 1, updatedTodo);

          return newTodos;
        });
        setEditedTitle('');
      })
      .catch(() => {
        setErrorMessage('Unable to update a todo');
        setSelectedTodo(updatedTodo);

        setTimeout(() => {
          if (titleField.current) {
            titleField.current.focus();
          }

          setErrorMessage('');
        }, 3000);
      })
      .finally(() => {
        setSelectedTodo(null);
        setCurrentTodoId(null);
      });
  };

  const handleDelete = (currentTodo: Todo) => {
    setIsDeletion(true);
    setCurrentTodoId(currentTodo.id);

    todoServices
      .deletePost(currentTodo)
      .then(() => {
        setTodos(todos.filter(todo => todo.id !== currentTodo.id));
      })
      .catch(() => {
        setErrorMessage('Unable to delete a todo');
        setTimeout(() => {
          if (titleField.current) {
            titleField.current.focus();
          }

          setErrorMessage('');
        }, 3000);
      })
      .finally(() => {
        setIsDeletion(false);
        setCurrentTodoId(null);
      });
  };

  const handleDeleteCompleted = async () => {
    const newTodos = [...todos.filter(todo => todo.completed)];

    for (const todo of newTodos) {
      try {
        await todoServices.deletePost(todo);
        setTodos(prevTodos => prevTodos.filter(t => t.id !== todo.id));
      } catch {
        setErrorMessage('Unable to delete a todo');
        setTimeout(() => {
          if (titleField.current) {
            titleField.current.focus();
          }

          setErrorMessage('');
        }, 3000);
      } finally {
        setIsDeletion(false);
      }
    }
  };

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();

    if (selectedTodo) {
      if (!editedTitle.trim() && wasEdited) {
        handleDelete(selectedTodo);
      } else if (!editedTitle.trim() && !wasEdited) {
        setEditedTitle(selectedTodo.title);
        setSelectedTodo(null);
      } else {
        const updatedTodo = { ...selectedTodo, title: editedTitle.trim() };

        updateTodo(updatedTodo);
      }
    } else {
      if (!title.trim()) {
        setErrorMessage('Title should not be empty');

        setTimeout(() => {
          setErrorMessage('');
        }, 3000);

        return;
      }

      setTempTodo({
        id: 0,
        userId: USER_ID,
        title: title.trim(),
        completed: false,
      });

      addTodo({
        id: +new Date(),
        userId: USER_ID,
        title: title.trim(),
        completed: false,
      });
    }
  };

  const value = {
    readyTodos,
    todos,
    setTodos,
    title,
    setTitle,
    handleSubmit,
    handleCompletedStatus,
    handleAllCompleted,
    errorMessage,
    setErrorMessage,
    filterField,
    setFilterField,
    titleField,
    editingTitleField,
    handleDelete,
    handleDeleteCompleted,
    isLoading,
    isDeletion,
    tempTodo,
    currentTodoId,
    selectedTodo,
    setSelectedTodo,
    editedTitle,
    setEditedTitle,
    wasEdited,
    setWasEdited,
  };

  return <TodoContext.Provider value={value}>{children}</TodoContext.Provider>;
};
