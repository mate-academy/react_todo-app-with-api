import React from 'react';
import { Todo } from '../types/Todo';
import { ErrorMessage } from './errorMessage';
import { updateTodoStatus } from '../todos';

type Params = {
  id: number;
  todos: Todo[];
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>;
  setErrorMessage: React.Dispatch<React.SetStateAction<string>>;
  setDeletingTodoIds: (updater: React.SetStateAction<number[]>) => void;
};

export const handleToggle = async ({
  id,
  todos,
  setTodos,
  setErrorMessage,
  setDeletingTodoIds,
}: Params) => {
  setDeletingTodoIds(prev => [...prev, id]);

  try {
    const todoToUpdate = todos.find(todo => todo.id === id);

    if (!todoToUpdate) {
      return;
    }

    const updatedTodo = await updateTodoStatus(id, !todoToUpdate.completed);

    setTodos(prev =>
      prev.map(todo =>
        todo.id === id ? { ...todo, completed: updatedTodo.completed } : todo,
      ),
    );
  } catch {
    setErrorMessage(ErrorMessage.UnableToUpdate);
    setTimeout(() => setErrorMessage(''), 3000);
  } finally {
    setDeletingTodoIds(prev => prev.filter(todoId => todoId !== id));
  }
};
