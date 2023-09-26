import React, {
  MutableRefObject,
  ReactNode,
  SetStateAction,
  createContext, useContext, useEffect, useRef, useState,
} from 'react';
import { editTodo, getTodos } from '../api/todos';
import { SortTypes, Todo } from '../types/Todo';

export interface TContext {
  todos: Todo[];
  setTodos: React.Dispatch<SetStateAction<Todo[]>>;
  hasError: null | string;
  handleError: (error: string) => void;
  sortType: SortTypes;
  setSortType: React.Dispatch<SetStateAction<SortTypes>>;
  setHasError: React.Dispatch<SetStateAction<string | null>>;
  tempTodos: Todo | null;
  setTempTodos: React.Dispatch<SetStateAction<Todo | null>>;
  idNew: number | null;
  setIdNew: React.Dispatch<SetStateAction<number | null>>;
  handleToggleStatus: (todoId: number) => void ;
  isToggled: boolean,
  setIsToggled: React.Dispatch<SetStateAction<boolean>>,
  handleToggleAllStatus:() => void,
  isToggledAll: boolean,
  setIsToggledAll: React.Dispatch<SetStateAction<boolean>>,
  titleInputRef: MutableRefObject<HTMLInputElement | null>
}

// Tworzymy kontekst
const TodoContext = createContext<TContext | null>(null);

// Tworzymy funkcje dostarczające kontekst do komponentów
export function useTodoContext() {
  return useContext(TodoContext);
}

const USER_ID = 11550;

export function TodoProvider({ children }: { children: ReactNode }) {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [hasError, setHasError] = useState<string | null>(null);
  const [sortType, setSortType] = useState<SortTypes>('all');
  const [tempTodos, setTempTodos] = useState<Todo | null>(null);
  const [idNew, setIdNew] = useState<number | null>(null);
  const [isToggled, setIsToggled] = useState<boolean>(false);
  const [isToggledAll, setIsToggledAll] = useState<boolean>(false);
  const titleInputRef = useRef<HTMLInputElement | null>(null);

  const handleError = (error: string) => {
    setHasError(error);
    setTimeout(() => setHasError(null), 3000);
  };

  useEffect(() => {
    // GET TODOS
    getTodos(USER_ID)
      .then((res) => {
        setTodos(res);
      })
      .catch(() => {
        handleError('Unable to load todos');
      });
  }, []);

  // const addTodo = (title: string) => {
  //   // Dodaj zadanie do stanu zadań
  //   setTodos([...todos: any, { title, completed: false }]);
  // };

  const handleToggleStatus = (todoId: number) => {
    const updatedTodoIndex = todos
      .findIndex((toggledtodo) => toggledtodo.id === todoId);

    // test czy znalazł
    if (updatedTodoIndex !== -1) {
      const updatedTodo = todos[updatedTodoIndex];
      // eslint-disable-next-line max-len
      const updatedTodoWithNewStatus = { ...updatedTodo, completed: !updatedTodo.completed };

      setIsToggled(true);

      editTodo(todoId, updatedTodoWithNewStatus)
        .then((res) => {
          // Skopiuj tablicę todos
          const updatedTodos = [...todos];

          // Zaktualizuj tylko jeden element w tablicy
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

    // Przygotuj tablicę zaktualizowanych zadań
    const updatedTodos = todos.map((todo) => ({
      ...todo,
      completed: !todo.completed,
    }));

    // Przeslij zaktualizowane zadania na serwer
    Promise.all(updatedTodos.map((todo) => editTodo(todo.id, todo)))
      .then((updatedTodosFromServer) => {
        // Po udanym zaktualizowaniu na serwerze, zaktualizuj lokalny stan
        setTodos(updatedTodosFromServer);
      })
      .catch((error) => {
        handleError('Unable to update todos');
        // eslint-disable-next-line no-console
        console.error(error);
      })
      .finally(() => {
        setIsToggled(false);
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
    idNew,
    setIdNew,
    handleToggleStatus,
    isToggled,
    setIsToggled,
    handleToggleAllStatus,
    isToggledAll,
    setIsToggledAll,
    titleInputRef,
  };

  return (
    <TodoContext.Provider value={contextValues}>
      {children}
    </TodoContext.Provider>
  );
}
