import React, { useEffect, useRef, useState } from 'react';
import cn from 'classnames';
import { USER_ID, addTodos, updateTodo } from '../../api/todos';
import { ErrorMessages } from '../../types/ErrorMessages';
import { Todo } from '../../types/Todo';

interface Props {
  todos: Todo[];
  setTodos: (todos: Todo[]) => void;
  setTempTodo: (tempTodo: Todo | null) => void;
  setErrorMessage: (message: string) => void;
  loadingIds: number[];
  setLoadingIds: React.Dispatch<React.SetStateAction<number[]>>;
}

export const Header: React.FC<Props> = ({
  todos,
  setTodos,
  setTempTodo,
  setErrorMessage,
  loadingIds,
  setLoadingIds,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [title, setTitle] = useState('');
  const [loading, setLoading] = useState(false);

  const allCompleted = todos.every(todo => todo.completed);

  useEffect(() => {
    inputRef.current?.focus();
  }, [todos, loading]);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value);
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    const trimmedTitle = title.trim();

    if (!trimmedTitle) {
      setErrorMessage(ErrorMessages.EmptyTitle);

      return;
    }

    setLoading(true);

    const newTodo: Todo = {
      id: 0,
      userId: USER_ID,
      title: trimmedTitle,
      completed: false,
    };

    setTempTodo({ ...newTodo, id: 0 });

    addTodos(newTodo)
      .then((todo: Todo) => {
        setTodos([...todos, todo]);
        setTitle('');
      })
      .catch(() => {
        setErrorMessage(ErrorMessages.UnableAdd);
        setTitle(newTodo.title);
      })
      .finally(() => {
        setLoading(false);
        setTempTodo(null);
      });
  };

  const completedForAll = () => {
    const updatedTodos = todos.map(todo => ({
      ...todo,
      completed: !allCompleted,
    }));

    const updatePromises = todos.map(todo =>
      todo.completed === allCompleted
        ? updateTodo({ ...todo, completed: !allCompleted })
        : Promise.resolve(),
    );

    const todoIds = updatedTodos.map(todo => todo.id);

    setLoadingIds(todoIds);

    Promise.all(updatePromises)
      .then(() => {
        setTodos(updatedTodos);
      })
      .catch(() => {
        setErrorMessage(ErrorMessages.UnableUpdate);
      })
      .finally(() => setLoadingIds([]));
  };

  return (
    <header className="todoapp__header">
      {!loading && todos.length > 0 && (
        <button
          type="button"
          className={cn('todoapp__toggle-all', { active: allCompleted })}
          data-cy="ToggleAllButton"
          onClick={completedForAll}
        />
      )}
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={title}
          ref={inputRef}
          data-cy="NewTodoField"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          onChange={handleInputChange}
          disabled={loading || !!loadingIds.length}
        />
      </form>
    </header>
  );
};
