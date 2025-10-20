import { updateTodoStatus } from '../todos';
import { ErrorMessage } from './errorMessage';
import { Todo } from '../types/Todo';
import React from 'react';

type Props = {
  todos: Todo[];
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>;
  setErrorMessage: React.Dispatch<React.SetStateAction<string>>;
  setDeletingTodoIds: React.Dispatch<React.SetStateAction<number[]>>;
};

export const handleToggleAll = async ({
  todos,
  setTodos,
  setErrorMessage,
  setDeletingTodoIds,
}: Props) => {
  const areAllCompleted = todos.every(todo => todo.completed);
  const newStatus = !areAllCompleted;
  const todosToUpdate = todos.filter(todo => todo.completed !== newStatus);

  if (todosToUpdate.length === 0) {
    return;
  }

  setDeletingTodoIds(prev => [...prev, ...todosToUpdate.map(t => t.id)]);
  try {
    const result = await Promise.all(
      todosToUpdate.map(todo =>
        updateTodoStatus(todo.id, newStatus).catch(() => null),
      ),
    );

    setTodos(prev =>
      prev.map(todo => {
        const updated = result.find(t => t && t.id === todo.id);

        return updated ? { ...todo, completed: updated.completed } : todo;
      }),
    );
  } catch {
    setErrorMessage(ErrorMessage.UnableToUpdate);
    setTimeout(() => setErrorMessage(''), 3000);
  } finally {
    setDeletingTodoIds(prev =>
      prev.filter(id => !todosToUpdate.map(t => t.id).includes(id)),
    );
  }
};
