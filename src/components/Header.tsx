import React, { useEffect, useRef, useState } from 'react';
import { Todo } from '../types/Todo';
import { USER_ID } from '../api/todos';
import classNames from 'classnames';

type Props = {
  handleAddTodo: ({
    title,
    userId,
    completed,
  }: Omit<Todo, 'id'>) => Promise<void>;
  isSubmitting: boolean;
  todos: Todo[];
  handleToggleTodo: (id: number) => void;
};

export const Header: React.FC<Props> = ({
  todos,
  handleAddTodo,
  isSubmitting,
  handleToggleTodo,
}) => {
  const [title, setTitle] = useState('');
  const inputRef = useRef<HTMLInputElement | null>(null);
  const allCompleted = todos.every(todo => todo.completed);
  const completedTodo = todos.some(todo => todo.completed);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [isSubmitting]);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const normalizedTitle = title.trim();

    const newTodo: Omit<Todo, 'id'> = {
      title: normalizedTitle,
      completed: false,
      userId: USER_ID,
    };

    return handleAddTodo(newTodo).then(() => setTitle(''));
  };

  const toggleAll = async () => {
    const completedTodosId = todos.map(todo => todo.id);

    if (completedTodo && !allCompleted) {
      const filteredTodos = todos.filter(todo => !todo.completed);
      const filteredTodosId = filteredTodos.map(todo => todo.id);

      await filteredTodosId.forEach(id => handleToggleTodo(id));
    } else {
      await completedTodosId.forEach(id => handleToggleTodo(id));
    }
  };

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
      <form onSubmit={handleSubmit}>
        <input
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={title}
          onChange={event => setTitle(event.target.value)}
          autoFocus
          ref={inputRef}
          disabled={isSubmitting}
        />
      </form>
    </header>
  );
};
