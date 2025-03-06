import classNames from 'classnames';
import React, { useCallback } from 'react';
import { Todo } from '../../types/Todo';
import { TodoForm } from '../TodoForm';

interface Props {
  todos: Todo[];
  onError: (error: string) => void;
  onTempTodo: (todo: Todo | null) => void;
  onAdd: (todo: Todo) => Promise<void>;
  onUpdate: (todos: Todo[]) => void;
}

export const TodoHeader: React.FC<Props> = ({
  todos,
  onError,
  onTempTodo,
  onAdd,
  onUpdate,
}) => {
  const allCompleted = todos.every(todo => todo.completed);

  const toggleAll = useCallback(() => {
    const updatedTodos = todos
      .filter(todo => (allCompleted ? todo.completed : !todo.completed))
      .map(todo => ({
        ...todo,
        completed: !allCompleted,
      }));

    if (updatedTodos.length > 0) {
      onUpdate(updatedTodos);
    }
  }, [todos, allCompleted, onUpdate]);

  return (
    <header className="todoapp__header">
      {todos.length > 0 && (
        <button
          type="button"
          className={classNames('todoapp__toggle-all', {
            active: allCompleted,
          })}
          data-cy="ToggleAllButton"
          onClick={toggleAll}
        />
      )}

      <TodoForm
        todos={todos}
        onError={onError}
        onAdd={onAdd}
        onTempTodo={onTempTodo}
      />
    </header>
  );
};
