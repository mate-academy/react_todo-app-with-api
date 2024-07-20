import React, { useMemo, useState } from 'react';
import { Status } from '../types/Status';
import { Todo } from '../types/Todo';

type TodosContextProps = {
  todos: Todo[];
  setTodos: (newValue: Todo[]) => void;
  filter: Status;
  setFilter: (status: Status) => void;
  loadErrorMessage: string | null;
  setLoadErrorMessage: (message: string) => void;
  isHidden: boolean;
  setIsHidden: (val: boolean) => void;
  allTodosButton: boolean;
  setAllTodosButton: (val: boolean) => void;
  isEditing: boolean;
  setIsEditing: (val: boolean) => void;
  tempTodo: null | Todo;
  setTempTodo: (tempTodo: null | Todo) => void;
  todosWithLoader: Todo[];
  setTodosWithLoader: (todo: Todo[]) => void;
  filteredTodos: Todo[];
};

export const TodosContext = React.createContext<TodosContextProps>({
  todos: [],
  setTodos: () => [],
  filter: Status.All,
  setFilter: () => {},
  loadErrorMessage: '',
  setLoadErrorMessage: () => {},
  isHidden: true,
  setIsHidden: () => {},
  allTodosButton: false,
  setAllTodosButton: () => {},
  isEditing: false,
  setIsEditing: () => {},
  tempTodo: null,
  setTempTodo: () => {},
  todosWithLoader: [],
  setTodosWithLoader: () => {},
  filteredTodos: [],
});

type Props = {
  children: React.ReactNode;
};

export const TodosProvider: React.FC<Props> = ({ children }) => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filter, setFilter] = useState(Status.All);
  const [loadErrorMessage, setLoadErrorMessage] = useState<string>('');
  const [isHidden, setIsHidden] = useState(true);
  const [allTodosButton, setAllTodosButton] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [tempTodo, setTempTodo] = useState<null | Todo>(null);
  const [todosWithLoader, setTodosWithLoader] = useState<Todo[]>([]);

  const filterTodos = (filtering: Status) => {
    let filteredTodos: Todo[] = [];
    let withSelected: Todo[] = [];

    switch (filtering) {
      case Status.Active:
        withSelected = todos.filter(
          todo => !todo.completed || todosWithLoader.includes(todo),
        );

        if (todosWithLoader) {
          filteredTodos = withSelected;
        } else {
          filteredTodos = todos.filter(todo => todo.completed);
        }

        break;

      case Status.Completed:
        withSelected = todos.filter(
          todo => todo.completed || todosWithLoader.includes(todo),
        );

        if (todosWithLoader) {
          filteredTodos = withSelected;
        } else {
          filteredTodos = todos.filter(todo => !todo.completed);
        }

        break;

      case Status.All:
      default:
        filteredTodos = todos;
    }

    return filteredTodos;
  };

  const filteredTodos = filterTodos(filter);

  const value = useMemo(
    () => ({
      todos,
      setTodos,
      filter,
      setFilter,
      filteredTodos,
      loadErrorMessage,
      setLoadErrorMessage,
      isHidden,
      setIsHidden,
      allTodosButton,
      setAllTodosButton,
      isEditing,
      setIsEditing,
      tempTodo,
      setTempTodo,
      todosWithLoader,
      setTodosWithLoader,
    }),
    [
      todos,
      filteredTodos,
      loadErrorMessage,
      isHidden,
      filter,
      setFilter,
      allTodosButton,
      tempTodo,
      setTempTodo,
      todosWithLoader,
      setTodosWithLoader,
      setIsEditing,
      isEditing,
    ],
  );

  return (
    <TodosContext.Provider value={value}>{children}</TodosContext.Provider>
  );
};
