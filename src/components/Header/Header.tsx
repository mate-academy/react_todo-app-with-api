import React, { FC, useEffect, useRef } from 'react';
import cn from 'classnames';

import { TypeError } from '../../types/TypeError';
import { USER_ID } from '../../api/todos';
import { Todo } from '../../types/Todo';

type Props = {
  todos: Todo[];
  setErrorMessage: (value: React.SetStateAction<TypeError>) => void;
  newTitle: string;
  setNewTitle: React.Dispatch<React.SetStateAction<string>>;
  onAddTodo: (newTodo: Omit<Todo, 'id'>) => void;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  loading: boolean;
  setTempTodo: React.Dispatch<React.SetStateAction<Todo | null>>;
  updateTodo: (updatedTodo: Todo) => void;
};

export const Header: FC<Props> = ({
  todos,
  setErrorMessage,
  newTitle,
  setNewTitle,
  onAddTodo,
  setLoading,
  loading,
  setTempTodo,
  updateTodo,
}) => {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const copletedTodosAll =
    todos.length > 0 && todos.every(todo => todo.completed);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!newTitle) {
      setErrorMessage(TypeError.EMPTY_TITLE);

      return;
    }

    const newTodo = {
      userId: USER_ID,
      title: newTitle.trim(),
      completed: false,
    };

    const newTemptTodo: Todo = {
      id: 0,
      ...newTodo,
    };

    setTempTodo(newTemptTodo);
    setLoading(true);

    onAddTodo(newTodo);
  };

  const handleToggleAll = () => {
    const hasActive = todos.some(todo => !todo.completed);

    todos
      .filter(todo => todo.completed !== hasActive)
      .forEach(todo => updateTodo({ ...todo, completed: hasActive }));
  };

  useEffect(() => {
    if (!loading) {
      inputRef.current?.focus();
    }
  }, [loading]);

  return (
    <>
      <header className="todoapp__header">
        {todos.length > 0 && !loading && (
          <button
            type="button"
            className={cn('todoapp__toggle-all', {
              active: copletedTodosAll,
            })}
            data-cy="ToggleAllButton"
            onClick={handleToggleAll}
          />
        )}

        <form onSubmit={handleSubmit}>
          <input
            data-cy="NewTodoField"
            type="text"
            className="todoapp__new-todo"
            placeholder="What needs to be done?"
            ref={inputRef}
            value={newTitle}
            onChange={event => {
              setNewTitle(event.target.value.trimStart());
            }}
            disabled={loading}
          />
        </form>
      </header>
    </>
  );
};
