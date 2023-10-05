import React, { FormEvent } from 'react';
import { Todo } from '../../types/Todo';
import { Status } from '../../types/FilterEnum';

type Props = {
  preparedTodos: Todo[];
  todos: Todo[];
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>;
  filterBy: string;
  setFilterBy: (item: Status) => void;
  errorOccured: string;
  setErrorOccured: (ErrorMessage: string) => void;
  USER_ID: number;
  title: string,
  setTitle: (title: string) => void;
  handleSubmit: (event: FormEvent) => void;
  handleDelete: (todo: Todo) => void;
  currentLoading: boolean;
  changingId: number[];
  setCurrentLoading: (meaning: boolean) => void;
  setChangingId: React.Dispatch<React.SetStateAction<number[]>>;
};

export const TodoContext = React.createContext<Props>({
  preparedTodos: [],
  todos: [],
  setTodos: () => { },
  filterBy: '',
  setFilterBy: () => { },
  errorOccured: '',
  setErrorOccured: () => {},
  USER_ID: 11589,
  title: '',
  setTitle: () => {},
  handleSubmit: () => {},
  handleDelete: () => {},
  currentLoading: false,
  changingId: [],
  setCurrentLoading: () => {},
  setChangingId: () => {},
});
