import { Todo } from '../types/Todo';
import { deleteTodo } from '../api/todos';
import { text } from '../constants/text';
import React, { RefObject } from 'react';

interface DeleteTodoParams {
  todo: Todo;
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>;
  setCustomError: (error: string) => void;
  handleLoaderId: (todo: Todo) => void;
  titleField: RefObject<HTMLInputElement>;
}

export const deleteTodoWithUI = async ({
  todo,
  setTodos,
  setCustomError,
  handleLoaderId,
  titleField,
}: DeleteTodoParams) => {
  setCustomError('');

  try {
    await deleteTodo(todo.id);
    setTodos(prevState =>
      prevState.filter(currentTodo => currentTodo.id !== todo.id),
    );
    setTimeout(() => {
      if (titleField.current) {
        titleField.current.focus();
      }
    }, 0);
    handleLoaderId(todo);
  } catch (err) {
    setCustomError(text.unableToDeleteTodo);
    handleLoaderId(todo);
    setTimeout(() => {
      if (titleField.current) {
        titleField.current.focus();
      }
    }, 0);
  }
};
