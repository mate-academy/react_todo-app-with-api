/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useRef, useState } from 'react';
import classNames from 'classnames';
import { Todo } from '../types/Todo';
import { Errors } from '../types/Errors';

interface Props {
  todos: Todo[],
  title: string,
  userId: number,
  isDisabledInput: boolean,
  setTodos: (todos: Todo[]) => void,
  setTitle: (str: string) => void,
  handleUpdateTodo: (todo: Todo) => void,
  handleAddTodo: (todo: Omit<Todo, 'id'>) => void
  setErrorMessage: (message: Errors | '') => void
}

export const Header: React.FC<Props> = ({
  todos,
  title,
  userId,
  isDisabledInput,
  setTitle,
  setTodos,
  handleAddTodo,
  setErrorMessage,
  handleUpdateTodo,
}) => {
  const [isCheckedAll, setIsCheckedAll] = useState(false);
  const inputField = useRef<HTMLInputElement>(null);

  const allTodosChecked = todos.every(todo => todo.completed);

  useEffect(() => {
    const newTodos = [...todos]
      .map(todo => ({ ...todo, completed: isCheckedAll }));

    setTodos(newTodos);

    Promise.all(newTodos.map(todo => (
      handleUpdateTodo({
        ...todo,
        completed: !isCheckedAll,
      })

    )));

  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isCheckedAll]);

  useEffect(() => {
    if (inputField.current) {
      inputField.current?.focus();
    }
  }, [isDisabledInput]);

  const handleSubmit = (e: React.FormEvent) => {
    const trimmedTitle = title.trim();

    e.preventDefault();

    if (trimmedTitle) {
      const newTodo: Omit<Todo, 'id'> = {
        title: trimmedTitle,
        userId,
        completed: false,
      };

      handleAddTodo(newTodo);
    } else {
      setErrorMessage(Errors.EmptyTitle);
    }

    setTitle('');
  };

  const handleCheckedAllButton = () => {
    setIsCheckedAll(!isCheckedAll);
  };

  return (
    <header className="todoapp__header">
      {todos[0] && (
        <button
          type="button"
          className={classNames('todoapp__toggle-all', {
            active: allTodosChecked,
          })}
          data-cy="ToggleAllButton"
          defaultChecked={isCheckedAll}
          onClick={handleCheckedAllButton}
        />
      )}

      <form onSubmit={handleSubmit}>
        <input
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          ref={inputField}
          value={title}
          disabled={isDisabledInput}
          onChange={(e) => setTitle(e.target.value)}
        />
      </form>
    </header>
  );
};
