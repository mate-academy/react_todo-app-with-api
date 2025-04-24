import { Todo } from '../../types/Todo';
import React from 'react';

export type TodoItemTypes = {
  deleteTodoHandler: (todo: Todo) => void;
  todo: Todo;
  loadingId: { [key: number]: boolean };
  handleChange: (todo: Todo) => void;
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>;
  setCustomError: (err: string) => void;
  handleLoaderId: (todo: Todo) => void;
  titleField: React.RefObject<HTMLInputElement>;
};
