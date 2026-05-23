import { useState } from 'react';
import { Nullable } from '../types/Nullable';
import { Todo } from '../types/Todo';

export const useTempTodo = () => {
  const [tempTodo, setTempTodo] = useState<Nullable<Todo>>(null);

  const createTempTodo = (title: string) => {
    setTempTodo({ id: 0, userId: 0, title, completed: false });
  };

  const removeTempTodo = () => {
    setTempTodo(null);
  };

  return { tempTodo, createTempTodo, removeTempTodo };
};
