import React, { useEffect, useRef, useState } from 'react';
import { Todo } from '../../types/Todo';
import { ErrorMessage } from '../../types/ErrorMessage';
import { addTodo, USER_ID } from '../../api/todos';
import cn from 'classnames';

type Props = {
  todos: Todo[];
  setErrorMessage: (error: ErrorMessage) => void;
  setTempTodo: (todo: Todo | null) => void;
  setTodos: (todos: Todo[]) => void;
  handleUpdateTodo: (
    todoId: number,
    updatedData: {},
    finallyCallback?: () => void,
  ) => void;
};

export const Header: React.FC<Props> = ({
  todos,
  setErrorMessage,
  setTempTodo,
  setTodos,
  handleUpdateTodo,
}) => {
  const [title, setTitle] = useState('');
  const [isDisabled, setIsDisabled] = useState(false);
  const input = useRef<HTMLInputElement>(null);
  const isAllTodoCompleted = todos.every(todo => todo.completed);

  useEffect(() => {
    input.current?.focus();
  }, [todos, isDisabled]);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const normalizeTitle = title.trim();

    if (!normalizeTitle) {
      setErrorMessage(ErrorMessage.EmptyTitle);

      return;
    }

    setIsDisabled(true);

    const newTodo = {
      title: normalizeTitle,
      userId: USER_ID,
      completed: false,
    };

    setTempTodo({ id: 0, ...newTodo });

    addTodo(newTodo)
      .then(todo => {
        setTodos([...todos, todo]);
        setTitle('');
      })
      .catch(() => setErrorMessage(ErrorMessage.AddTodo))
      .finally(() => {
        setTempTodo(null);
        setIsDisabled(false);
      });
  };

  const handleToggleAllClick = () => {
    const todosToChange = isAllTodoCompleted
      ? todos
      : todos.filter(todo => !todo.completed);

    todosToChange.forEach(todo => {
      handleUpdateTodo(todo.id, { completed: !todo.completed });
    });
  };

  return (
    <header className="todoapp__header">
      {!!todos.length && (
        <button
          type="button"
          className={cn('todoapp__toggle-all', {
            active: isAllTodoCompleted,
          })}
          data-cy="ToggleAllButton"
          onClick={handleToggleAllClick}
        />
      )}

      <form onSubmit={handleSubmit}>
        <input
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          disabled={isDisabled}
          value={title}
          ref={input}
          placeholder="What needs to be done?"
          onChange={event => setTitle(event.target.value)}
        />
      </form>
    </header>
  );
};
