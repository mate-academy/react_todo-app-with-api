import classNames from 'classnames';
import { Todo } from '../../types/Todo';
import { updateTodos } from '../../api/todos';
import React from 'react';

type Props = {
  todos: Todo[];
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>;
};

export const ToggleAll: React.FC<Props> = ({ todos, setTodos }) => {
  const allToDoCompleted = todos.every(todo => todo.completed);
  const isEnabled = todos.length > 0;

  const updateComplete = async () => {
    const newStatus = !allToDoCompleted;

    try {
      const todosToUpdate = todos.filter(todo => todo.completed !== newStatus);

      await Promise.all(
        todosToUpdate.map(todo => {
          const id = todo.id ?? -1;

          return updateTodos(id, { ...todo, completed: newStatus });
        }),
      );
      setTodos(prev => prev.map(todo => ({ ...todo, completed: newStatus })));
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Failed to update:', error);
    }
  };

  return isEnabled ? (
    <button
      onClick={updateComplete}
      type="button"
      className={classNames('todoapp__toggle-all', {
        active: allToDoCompleted,
      })}
      data-cy="ToggleAllButton"
    />
  ) : null;
};
