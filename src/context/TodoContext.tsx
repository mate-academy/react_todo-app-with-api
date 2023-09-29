import React, {
  MutableRefObject,
  ReactNode,
  SetStateAction,
  createContext, useContext, useEffect, useRef, useState,
} from 'react';
import { deleteTodo, editTodo, getTodos } from '../api/todos';
import { ErrorTypes, SortTypes, Todo } from '../types/Todo';

export interface TContext {
  todos: Todo[];
  setTodos: React.Dispatch<SetStateAction<Todo[]>>;
  hasError: null | ErrorTypes;
  handleError: (error: ErrorTypes) => void;
  sortType: SortTypes;
  setSortType: React.Dispatch<SetStateAction<SortTypes>>;
  setHasError: React.Dispatch<SetStateAction<ErrorTypes | null>>;
  tempTodos: Todo | null;
  setTempTodos: React.Dispatch<SetStateAction<Todo | null>>;
  handleToggleStatus: (todoId: number) => void ;
  isToggled: boolean,
  setIsToggled: React.Dispatch<SetStateAction<boolean>>,
  handleToggleAllStatus:() => void,
  isToggledAll: boolean,
  setIsToggledAll: React.Dispatch<SetStateAction<boolean>>,
  titleInputRef: MutableRefObject<HTMLInputElement | null>,
  editedRef: MutableRefObject<HTMLInputElement | null>,
  isGroupDeleting: boolean,
  setIsGroupDeleting: React.Dispatch<SetStateAction<boolean>>,
  isDeleting: boolean,
  setIsDeleting: React.Dispatch<SetStateAction<boolean>>,
  handleDelete: (todoId: number) => void ;
}

const TodoContext = createContext<TContext | null>(null);

export function useTodoContext() {
  return useContext(TodoContext);
}

const USER_ID = 11550;

export function TodoProvider({ children }: { children: ReactNode }) {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [hasError, setHasError] = useState<ErrorTypes | null>(null);
  const [sortType, setSortType] = useState<SortTypes>('all');
  const [tempTodos, setTempTodos] = useState<Todo | null>(null);
  const [isToggled, setIsToggled] = useState<boolean>(false);
  const [isToggledAll, setIsToggledAll] = useState<boolean>(false);
  const titleInputRef = useRef<HTMLInputElement | null>(null);
  const [isGroupDeleting, setIsGroupDeleting] = useState<boolean>(false);
  const editedRef = useRef<HTMLInputElement | null>(null);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);

  const handleError = (error: ErrorTypes) => {
    setHasError(error);
    setTimeout(() => setHasError(null), 3000);
  };

  useEffect(() => {
    getTodos(USER_ID)
      .then((res) => {
        setTodos(res);
      })
      .catch(() => {
        handleError('Unable to load todos');
      });
  }, []);

  const handleToggleStatus = (todoId: number) => {
    const updatedTodoIndex = todos
      .findIndex((toggledtodo) => toggledtodo.id === todoId);

    if (updatedTodoIndex !== -1) {
      const updatedTodo = todos[updatedTodoIndex];
      const newStatus = !updatedTodo.completed;

      setIsToggled(true);

      editTodo(todoId, { completed: newStatus })
        .then((res) => {
          const updatedTodos = [...todos];

          updatedTodos[updatedTodoIndex] = res;

          setTodos(updatedTodos);
        })
        .catch((error) => {
          handleError('Unable to update a todo');
          // eslint-disable-next-line no-console
          console.log(error);
        })
        .finally(() => {
          setIsToggled(false);
          titleInputRef.current?.focus();
        });
    }
  };

  const handleToggleAllStatus = () => {
    setIsToggled(true);

    const updatedTodos = todos.map((todo) => ({
      ...todo,
      completed: !todo.completed,
    }));

    setTodos(updatedTodos);

    Promise.all(updatedTodos.map((todo) => editTodo(todo.id, todo)))
      .then((updatedTodosFromServer) => {
        setTodos(updatedTodosFromServer);
      })
      .catch((error) => {
        handleError('Unable to update a todo');
        // eslint-disable-next-line no-console
        console.error(error);
      })
      .finally(() => {
        setIsToggled(false);
        titleInputRef.current?.focus();
      });
  };

  const handleDelete = (todoId: number) => {
    setIsDeleting(true);

    deleteTodo(todoId)
      .then(() => {
        setTodos((prevTodos) => prevTodos.filter((el) => el.id !== todoId));
      })
      .catch(() => {
        handleError('Unable to delete a todo');
      })
      .finally(() => {
        setIsDeleting(false);
        titleInputRef.current?.focus();
      });
  };

  const contextValues: TContext = {
    todos,
    setTodos,
    hasError,
    setHasError,
    handleError,
    sortType,
    setSortType,
    tempTodos,
    setTempTodos,
    handleToggleStatus,
    isToggled,
    setIsToggled,
    handleToggleAllStatus,
    isToggledAll,
    setIsToggledAll,
    titleInputRef,
    isGroupDeleting,
    setIsGroupDeleting,
    editedRef,
    isDeleting,
    setIsDeleting,
    handleDelete,
  };

  return (
    <TodoContext.Provider value={contextValues}>
      {children}
    </TodoContext.Provider>
  );
}
