import React, {
  Dispatch,
  SetStateAction, useMemo, useState,
} from 'react';
import { Status, Todo } from '../types/Todo';

type TodosContextType = {
  todos: Todo[];
  setTodos: Dispatch<SetStateAction<Todo[]>>;
  selectedStatus: Status;
  setSelectedStatus: Dispatch<SetStateAction<Status>>;
  title: string,
  setTitle: Dispatch<SetStateAction<string>>,
  visibleTodos: Todo[],
  loadingTodos: boolean,
  setLoadingTodos: Dispatch<SetStateAction<boolean>>,
  errorMessage: string,
  setErrorMessage: Dispatch<SetStateAction<string>>,
  errorHidden: boolean,
  setErrorHidden: Dispatch<SetStateAction<boolean>>,
  tempTodo: Todo | null,
  setTempTodo: Dispatch<SetStateAction<Todo | null>>,
  loadingUpdatedTodo: boolean,
  setLoadingUpdatedtodo: Dispatch<SetStateAction<boolean>>,
  editedTitle: string,
  setEditedTitle: Dispatch<SetStateAction<string>>,
  selectedTodo: Todo | null,
  setSelectedTodo: Dispatch<SetStateAction<Todo | null>>
};

export const TodosContext = React.createContext<TodosContextType>({
  todos: [],
  setTodos: () => {},
  selectedStatus: Status.all,
  setSelectedStatus: () => {},
  title: '',
  setTitle: () => {},
  visibleTodos: [],
  loadingTodos: false,
  setLoadingTodos: () => {},
  errorMessage: '',
  setErrorMessage: () => {},
  errorHidden: true,
  setErrorHidden: () => {},
  tempTodo: null,
  setTempTodo: () => {},
  loadingUpdatedTodo: false,
  setLoadingUpdatedtodo: () => {},
  editedTitle: '',
  setEditedTitle: () => {},
  selectedTodo: null,
  setSelectedTodo: () => {},
});

type Props = {
  children: React.ReactNode,
};

export const TodosProvider: React.FC<Props> = ({ children }) => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [selectedStatus, setSelectedStatus] = useState(Status.all);
  const [title, setTitle] = useState('');

  const [loadingTodos, setLoadingTodos] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [errorHidden, setErrorHidden] = useState(true);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [loadingUpdatedTodo, setLoadingUpdatedtodo] = useState(false);
  const [editedTitle, setEditedTitle] = useState('');
  const [selectedTodo, setSelectedTodo] = useState<Todo | null>(null);

  const visibleTodos = [...todos].filter(todo => {
    switch (selectedStatus) {
      case Status.active:
        return !todo.completed;

      case Status.completed:
        return todo.completed;

      default:
        return true;
    }
  });

  const values = useMemo(() => ({
    todos,
    setTodos,
    selectedStatus,
    setSelectedStatus,
    title,
    setTitle,
    visibleTodos,
    loadingTodos,
    setLoadingTodos,
    errorMessage,
    setErrorMessage,
    errorHidden,
    setErrorHidden,
    tempTodo,
    setTempTodo,
    loadingUpdatedTodo,
    setLoadingUpdatedtodo,
    editedTitle,
    setEditedTitle,
    selectedTodo,
    setSelectedTodo,
  }), [
    todos, setTodos, selectedStatus, title, visibleTodos,
    loadingTodos, setLoadingTodos, errorMessage, setErrorMessage,
    errorHidden, setErrorHidden, tempTodo, setTempTodo, loadingUpdatedTodo,
    setLoadingUpdatedtodo, editedTitle, setEditedTitle, selectedTodo,
    setSelectedTodo,
  ]);

  return (
    <TodosContext.Provider value={values}>
      {children}
    </TodosContext.Provider>
  );
};
