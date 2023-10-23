import React, { useState } from 'react';
import classNames from 'classnames';
import { Todo } from '../../types/Todo';
import { TodoPatch } from '../../types/TodoPatch';

type Props = {
  todos: Todo[],
  onAddTodo: (title: string) => void,
  onUpdateTodo: (todoId: number, data: TodoPatch) => void,
};

export const TodoForm: React.FC<Props> = ({
  todos,
  onAddTodo,
  onUpdateTodo,
}) => {
  const [todoTitle, setTodoTitle] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const hasTodos = Boolean(todos.length);
  const hasActiveTodos = todos.filter(todo => !todo.completed);
  const hasAllCompleted = todos.every(todo => todo.completed);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    setIsLoading(true);
    try {
      await onAddTodo(todoTitle.trim());
    } catch (error) {
      if (error instanceof Error) {
        // eslint-disable-next-line no-console
        console.log(error.message);
      }
    }

    setIsLoading(false);
    setTodoTitle('');
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTodoTitle(event.target.value);
  };

  const onCheckActiveTodos = () => {
    if (hasActiveTodos.length === 0) {
      todos.forEach(todo => {
        onUpdateTodo(todo.id, { completed: false });
      });
    }

    hasActiveTodos.forEach(todo => {
      onUpdateTodo(todo.id, { completed: true });
    });
  };

  return (
    <header className="todoapp__header">
      {hasTodos && (
        <button
          aria-label="setAllComplete"
          type="button"
          className={classNames('todoapp__toggle-all', {
            active: hasAllCompleted,
          })}
          onClick={onCheckActiveTodos}
        />
      )}

      <form
        onSubmit={handleSubmit}
      >
        <input
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={todoTitle}
          onChange={handleChange}
          disabled={isLoading}
        />
      </form>
    </header>
  );
};
