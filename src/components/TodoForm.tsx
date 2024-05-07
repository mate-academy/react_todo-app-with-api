import React, { useState } from 'react';

import { TodosArrayType } from '../types/Todo';

type Props = {
  todos: TodosArrayType;
  addTodo: (newPostTitle: string) => Promise<boolean>;
  inputIsDisabled: boolean;
  markAllTodos: () => Promise<void>;
  renameTodo(todoId: number, newTitle: string): Promise<boolean>;
};

export default function TodoForm({
  todos,
  addTodo,
  inputIsDisabled,
  markAllTodos,
}: Props) {
  const [newPostTitle, setNewPostTitle] = useState<string>('');

  function handleInputChange(e: React.FormEvent) {
    e.preventDefault();
    addTodo(newPostTitle.trim()).then(hasSucceded => {
      if (hasSucceded) {
        setNewPostTitle('');
      }
    });
  }

  function handleButtonClick() {
    markAllTodos();
  }

  return (
    <header className="todoapp__header">
      {/* this button should have `active` class only if all todos are completed */}
      {todos.length !== 0 && (
        <button
          type="button"
          className={
            'todoapp__toggle-all ' +
            (todos.every(({ completed }) => completed) ? 'active' : '')
          }
          data-cy="ToggleAllButton"
          onClick={handleButtonClick}
        />
      )}

      {/* Add a todo on form submit */}
      <form onSubmit={handleInputChange}>
        <input
          data-cy="NewTodoField"
          type="text"
          id="newTodoInput"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={newPostTitle}
          onChange={({ target }) => {
            setNewPostTitle(target.value);
          }}
          autoFocus
          disabled={inputIsDisabled}
        />
      </form>
    </header>
  );
}
