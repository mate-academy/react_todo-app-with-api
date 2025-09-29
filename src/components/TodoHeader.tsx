import React, { useState, useEffect } from 'react';
import classNames from 'classnames';
import { Todo } from '../types/Todo';

interface TodoHeaderProps {
  todos: Todo[];
  onAddTodo: (title: string) => Promise<void>;
  onToggleAll: () => Promise<void>;
  isLoading: boolean;
  isAddingTodo: boolean;
  todoInputRef: React.RefObject<HTMLInputElement>;
}

export const TodoHeader: React.FC<TodoHeaderProps> = ({
  todos,
  onAddTodo,
  onToggleAll,
  isLoading,
  isAddingTodo,
  todoInputRef,
}) => {
  const [title, setTitle] = useState('');

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onAddTodo(title)
      .then(() => {
        setTitle('');
      })
      .catch(() => {
        todoInputRef.current?.focus();
      });
  };

  useEffect(() => {
    if (!isAddingTodo) {
      todoInputRef.current?.focus();
    }
  }, [isAddingTodo, todoInputRef]);

  return (
    <header className="todoapp__header">
      {todos.length > 0 && !isLoading && (
        <button
          type="button"
          className={classNames('todoapp__toggle-all', {
            active: todos.every(todo => todo.completed),
          })}
          data-cy="ToggleAllButton"
          onClick={onToggleAll}
        />
      )}
      <form onSubmit={handleSubmit}>
        <input
          ref={todoInputRef}
          value={title}
          autoFocus
          onChange={e => setTitle(e.target.value)}
          disabled={isAddingTodo}
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
        />
      </form>
    </header>
  );
};
