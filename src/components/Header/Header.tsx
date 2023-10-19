/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useRef } from 'react';
import cn from 'classnames';
import { Message } from '../../types/Message';
import { USER_ID } from '../../utils/fetchClient';
import { Todo } from '../../types/Todo';

type Props = {
  titleTodo: string,
  setTitleTodo: (t: string) => void,
  setErrorMessage: (m: Message | '') => void,
  onAddTodo: (t: Todo) => void,
  isLoading: boolean,
  setTodos: (t: Todo[]) => void
  todos: Todo[],
  updateTodosAllStatus: (t: Todo[]) => void,

};

export const Header: React.FC<Props> = React.memo(({
  titleTodo,
  setTitleTodo,
  setErrorMessage,
  onAddTodo,
  isLoading,
  todos,
  updateTodosAllStatus,
}) => {
  const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTitleTodo(event.target.value);
  };

  const handleAddTodo = (event: React.FormEvent) => {
    event.preventDefault();
    if (!titleTodo.trim()) {
      setErrorMessage(Message.TitleEmty);

      return;
    }

    onAddTodo({
      id: +new Date(),
      userId: USER_ID,
      title: titleTodo.trim(),
      completed: false,
    });
  };

  const fieldTitle = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (fieldTitle.current) {
      fieldTitle.current.focus();
    }
  }, [isLoading]);

  const isAllCompleted = todos.every(todo => todo.completed);

  const handleToggleAll = () => {
    const switchingTodos = todos.filter(
      todo => todo.completed === isAllCompleted,
    );

    updateTodosAllStatus(switchingTodos.map(item => ({
      ...item,
      completed: !isAllCompleted,
    })));
  };

  return (
    <header className="todoapp__header">
      {todos.length > 0 && (
        <button
          type="button"
          className={cn('todoapp__toggle-all', {
            active: isAllCompleted,
          })}
          data-cy="ToggleAllButton"
          onClick={handleToggleAll}
        />
      )}

      <form
        onSubmit={handleAddTodo}
      >
        <input
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          ref={fieldTitle}
          value={titleTodo}
          onChange={handleTitleChange}
          disabled={isLoading}
        />
      </form>
    </header>
  );
});
