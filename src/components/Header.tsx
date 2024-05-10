import { FC, Ref, useEffect, useRef, useState } from 'react';
import React from 'react';

import { TodoType } from '../types/Todo';

type Props = {
  todos: TodoType[];
  addTodo: (newTodoTitle: string) => Promise<boolean>;
  isInputDisabled: boolean;
  todoInput: Ref<HTMLInputElement>;
  renameTodo(todoId: number, newTitle: string): Promise<boolean>;
  checkTodos: () => void;
};

export const Header: FC<Props> = ({
  todos,
  addTodo,
  isInputDisabled,
  todoInput,
  checkTodos,
}) => {
  const [newTodoTitle, setNewTodoTitle] = useState<string>('');
  const newTodoInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (newTodoInputRef.current) {
      newTodoInputRef.current.focus();
    }
  }, [todos]);

  const handleNewTodoForm = (e: React.FormEvent) => {
    e.preventDefault();
    addTodo(newTodoTitle).then(didSucceed => {
      if (didSucceed) {
        setNewTodoTitle('');
      }
    });
  };

  const handleClick = () => {
    checkTodos();
  };

  return (
    <header className="todoapp__header">
      {todos.length !== 0 && (
        <button
          type="button"
          className={
            'todoapp__toggle-all ' +
            (todos.every(({ completed }) => completed) ? 'active' : '')
          }
          data-cy="ToggleAllButton"
          onClick={handleClick}
        />
      )}

      {/* Add a todos on form submit */}
      <form onSubmit={handleNewTodoForm}>
        <input
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          id="todoapp__new-todo"
          placeholder="What needs to be done?"
          ref={todoInput}
          value={newTodoTitle}
          onChange={e => {
            setNewTodoTitle(e.target.value);
          }}
          autoFocus
          disabled={isInputDisabled}
        />
      </form>
    </header>
  );
};
