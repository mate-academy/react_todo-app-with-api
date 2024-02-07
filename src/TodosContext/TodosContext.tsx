/* eslint-disable max-len */
import React, {
  Dispatch, SetStateAction, useEffect, useMemo, useState,
} from 'react';
import { ErrorMessage } from '../types/ErrorMessage';
import { Todo } from '../types/Todo';
import * as todoService from '../api/todos';
import { FilteringBy } from '../types/FilteringBy';

interface TodosContextProps {
  isSubmiting: boolean,
  setSubmiting: React.Dispatch<React.SetStateAction<boolean>>,
  editedTodoTitle: string,
  setEditedTodoTitle: React.Dispatch<React.SetStateAction<string>>,
  handleSpanDoubleClick: (id: number, title: string) => void,
  handleDeleteTodo: (todoId: number) => void;
  editedTodoId: number | null,
  handleEditTodo: (event: React.FormEvent<HTMLFormElement>, todoId: number) => void,
  handleCompleteChange: (todoId: number, checked: boolean) => void,
  handleSetAllAsComplited: () => void,
  handlerFormSubmit: (event: React.FormEvent<HTMLFormElement>) => void,
  setErrorMessage: Dispatch<SetStateAction<ErrorMessage | null>>,
  temptTodo: Todo | null,
  todos: Todo[],
  setTodos: Dispatch<SetStateAction<Todo[]>>,
  newTodoTitle: string,
  setNewTodoTitle: Dispatch<SetStateAction<string>>
  errorMessage: ErrorMessage | null,
  handleClearCompleted: () => void,
  filteringBy: FilteringBy,
  setFilteringBy: Dispatch<SetStateAction<FilteringBy>>,
  handleEditKeyUp: (event: React.KeyboardEvent<HTMLInputElement>) => void,
  stopEditTodo: () => void,
  startValue: string,
  setStartValue: Dispatch<SetStateAction<string>>,
  processingIds: number[],
  handleEditTodoOnBlur: (todoId: number) => void,
}

export const TodosContext = React.createContext<TodosContextProps>({
  isSubmiting: false,
  setSubmiting: () => { },
  editedTodoTitle: '',
  setEditedTodoTitle: () => { },
  handleSpanDoubleClick: () => { },
  handleDeleteTodo: () => { },
  editedTodoId: 0,
  handleEditTodo: () => { },
  handleCompleteChange: () => { },
  handleSetAllAsComplited: () => { },
  handlerFormSubmit: () => { },
  setErrorMessage: () => { },
  temptTodo: {
    id: 0, userId: 0, title: '', completed: false,
  },
  todos: [],
  setTodos: () => {},
  newTodoTitle: '',
  setNewTodoTitle: () => {},
  errorMessage: null,
  handleClearCompleted: () => {},
  filteringBy: FilteringBy.default,
  setFilteringBy: () => { },
  handleEditKeyUp: () => {},
  stopEditTodo: () => {},
  startValue: '',
  setStartValue: () => {},
  processingIds: [],
  handleEditTodoOnBlur: () => {},
});

export const USER_ID = 76;

type Props = {
  children: React.ReactNode;
};

export const TodosProvider: React.FC<Props> = ({ children }) => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [isSubmiting, setIsSubmiting] = useState(false);
  const [editedTodoTitle, setEditedTodoTitle] = useState('');
  const [editedTodoId, setEditedTodoId] = useState<null | number>(null);
  const [temptTodo, setTempTodo] = useState<Todo | null>(null);
  const [newTodoTitle, setNewTodoTitle] = useState('');
  const [filteringBy, setFilteringBy] = useState(FilteringBy.default);
  const [errorMessage, setErrorMessage] = useState<ErrorMessage | null>(null);
  const [startValue, setStartValue] = useState('');
  const [processingIds, setProcessingIds] = useState<number[]>([]);

  useEffect(() => {
    todoService.getTodos(USER_ID)
      .then(setTodos)
      .catch(() => {
        setErrorMessage(ErrorMessage.UnableToLoadTodos);

        setTimeout(() => setErrorMessage(null), 3000);
      });
  }, []);

  const isAllCompleted = useMemo(() => {
    return todos.every((todo) => todo.completed);
  }, [todos]);

  const handleSpanDoubleClick = (
    id: number,
    title: string,
  ) => {
    setEditedTodoId(id);
    setEditedTodoTitle(title);
    setStartValue(title);
  };

  const handleDeleteEmptyTodo = (todoId: number) => {
    setIsSubmiting(true);
    setEditedTodoId(0);
    setProcessingIds((prev) => [...prev, todoId]);
    todoService.deleteTodo(todoId)
      .then(() => {
        setTodos(prev => prev.filter(todo => todo.id !== todoId));
        setIsSubmiting(false);
        setProcessingIds((prev) => prev.filter(currTodoId => currTodoId !== todoId));
      }).catch(() => {
        setIsSubmiting(false);
        setErrorMessage(ErrorMessage.UnableToDeleteATodo);
        setEditedTodoId(todoId);
        setProcessingIds((prev) => prev.filter(currTodoId => currTodoId !== todoId));
        setTimeout(() => setErrorMessage(null), 3000);
      });
  };

  const handleEditTodo = (
    event: React.FormEvent<HTMLFormElement>, todoId: number,
  ) => {
    event.preventDefault();

    if (editedTodoTitle) {
      if (startValue !== editedTodoTitle) {
        setEditedTodoId(null);
        setProcessingIds((curr) => [...curr, todoId]);
        todoService.editTodo(todoId, { title: editedTodoTitle })
          .then(() => {
            setTodos(prev => prev.map(todo => {
              if (todo.id === todoId) {
                return { ...todo, title: editedTodoTitle.trim() };
              }

              return todo;
            }));
            setProcessingIds((curr) => curr.filter(c => c !== todoId));
          })
          .catch(() => {
            setErrorMessage(ErrorMessage.UnableToUpdateATodo);
            setTimeout(() => setErrorMessage(null), 3000);
            setEditedTodoId(todoId);
            setProcessingIds((curr) => curr.filter(c => c !== todoId));
          });
      } else {
        setEditedTodoId(null);
      }
    } else if (!editedTodoTitle) {
      handleDeleteEmptyTodo(editedTodoId as number);
    }
  };

  const handleEditTodoOnBlur = (todoId: number) => {
    if (editedTodoTitle) {
      if (startValue !== editedTodoTitle) {
        setEditedTodoId(null);
        setProcessingIds((curr) => [...curr, todoId]);
        todoService.editTodo(todoId, { title: editedTodoTitle })
          .then(() => {
            setTodos(prev => prev.map(todo => {
              if (todo.id === todoId) {
                return { ...todo, title: editedTodoTitle.trim() };
              }

              return todo;
            }));
            setProcessingIds((curr) => curr.filter(c => c !== todoId));
          })
          .catch(() => {
            setErrorMessage(ErrorMessage.UnableToUpdateATodo);
            setTimeout(() => setErrorMessage(null), 3000);
            setEditedTodoId(todoId);
            setProcessingIds((curr) => curr.filter(c => c !== todoId));
          });
      } else {
        setEditedTodoId(null);
      }
    } else if (!editedTodoTitle) {
      handleDeleteEmptyTodo(editedTodoId as number);
    }
  };

  const handleEditKeyUp = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Escape') {
      setEditedTodoId(null);
    }
  };

  const stopEditTodo = () => {
    setEditedTodoId(null);
  };

  const handleDeleteTodo = (todoId: number) => {
    setIsSubmiting(true);
    setEditedTodoId(0);
    setProcessingIds((prev) => [...prev, todoId]);
    todoService.deleteTodo(todoId)
      .then(() => {
        setTodos(prev => prev.filter(todo => todo.id !== todoId));
        setIsSubmiting(false);
        setProcessingIds((prev) => prev.filter(currTodoId => currTodoId !== todoId));
      }).catch(() => {
        setIsSubmiting(false);
        setErrorMessage(ErrorMessage.UnableToDeleteATodo);
        setTimeout(() => setErrorMessage(null), 3000);
      });
  };

  const handleCompleteChange = (todoId: number, checked: boolean) => {
    setProcessingIds((curr) => [...curr, todoId]);
    todoService.editTodo(todoId, { completed: checked })
      .then(() => {
        setTodos(currentTodos => currentTodos.map(todo => {
          if (todo.id === todoId) {
            return { ...todo, completed: checked };
          }

          return todo;
        }));
        setEditedTodoId(null);
        setProcessingIds((curr) => curr.filter(c => c !== todoId));
      })
      .catch(() => {
        setErrorMessage(ErrorMessage.UnableToUpdateATodo);
        setTimeout(() => setErrorMessage(null), 3000);
        setProcessingIds((curr) => curr.filter(c => c !== todoId));
      });
  };

  const handleSetAllAsComplited = () => {
    if (!isAllCompleted) {
      todos.forEach(todo => {
        if (!todo.completed) {
          handleCompleteChange(todo.id, true);
        }
      });
    } else {
      todos.forEach(todo => {
        handleCompleteChange(todo.id, false);
      });
    }
  };

  const handleClearCompleted = () => {
    const todosToDelete = todos.filter(todo => todo.completed);

    const idsOfTodosToDelete = todosToDelete.map((todo) => todo.id);

    setProcessingIds(prev => [...prev, ...idsOfTodosToDelete]);

    todosToDelete.map(todo => {
      setIsSubmiting(true);

      return todoService.deleteTodo(todo.id)
        .then(() => {
          setTodos((prev) => {
            return prev.filter((currTodo) => currTodo.id !== todo.id);
          });
          setIsSubmiting(false);
        }).catch(() => {
          setErrorMessage(ErrorMessage.UnableToDeleteATodo);
          setTimeout(() => setErrorMessage(null), 3000);
        });
    });
  };

  const handlerFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!newTodoTitle.trim()) {
      setErrorMessage(ErrorMessage.TitleShouldNotBeEmpty);

      setTimeout(() => setErrorMessage(null), 3000);

      return;
    }

    setIsSubmiting(true);

    const newTodo = {
      id: 0,
      userId: USER_ID,
      title: newTodoTitle.trim(),
      completed: false,
    };

    setTempTodo(newTodo);

    todoService.addTodo(USER_ID, newTodo).then((todo) => {
      setTodos(prevTodos => [...prevTodos, todo]);

      setNewTodoTitle('');
      setIsSubmiting(false);
    }).catch(() => {
      setErrorMessage(ErrorMessage.UnableToAddATodo);
      setTimeout(() => setErrorMessage(null), 3000);
      setIsSubmiting(false);
    })
      .finally(() => {
        setTempTodo(null);
      });
  };

  const value = {
    isSubmiting,
    setSubmiting: setIsSubmiting,
    editedTodoTitle,
    setEditedTodoTitle,
    handleSpanDoubleClick,
    handleDeleteTodo,
    editedTodoId,
    handleEditTodo,
    handleCompleteChange,
    handleSetAllAsComplited,
    handlerFormSubmit,
    setErrorMessage,
    temptTodo,
    todos,
    setTodos,
    newTodoTitle,
    setNewTodoTitle,
    errorMessage,
    handleClearCompleted,
    filteringBy,
    setFilteringBy,
    handleEditKeyUp,
    stopEditTodo,
    startValue,
    setStartValue,
    processingIds,
    handleEditTodoOnBlur,
  };

  return (
    <TodosContext.Provider value={value}>
      {children}
    </TodosContext.Provider>
  );
};
