import classNames from 'classnames';
import React from 'react';
import { Todo } from '../../types/Todo';
import { AddTodoForm } from '../AddTodoForm';

type Props = {
  addNewTodo: (title: string) => void
  activeTodosCount: number;
  visibleTodos: Todo[];
  updateTodo: (todo: Todo, key:keyof Todo, value: string | boolean) => void;
};

export const Header: React.FC<Props> = ({
  addNewTodo,
  updateTodo,
  activeTodosCount,
  visibleTodos,
}) => {
  const handleToggleAllButton = () => {
    const activeTodos = activeTodosCount
      ? visibleTodos.filter(todo => !todo.completed)
      : visibleTodos;

    activeTodos.forEach(todo => updateTodo(todo, 'completed', !todo.completed));
  };

  return (
    <header className="todoapp__header">
      <button
        type="button"
        aria-label="Toggle-all-statuses button"
        className={classNames(
          'todoapp__toggle-all',
          {
            active: !activeTodosCount,
          },
        )}
        onClick={handleToggleAllButton}
      />

      <AddTodoForm
        addNewTodo={addNewTodo}
      />
    </header>
  );
};
