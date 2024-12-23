import React, { FormEvent, useRef, useEffect, useState } from 'react';
import { ErrorType } from '../../types/ErrorType';
import { Todo } from '../../types/Todo';
import classNames from 'classnames';

type Props = {
  onAddTodo: (title: string) => Promise<void>;
  sendError: (error: ErrorType) => void;
  todoList: Todo[];
  isSubmitting: boolean;
  title: string;
  setTitle: (title: string) => void;
  onCompletingAll: (status: boolean) => Promise<void>;
  isAllCompleted: boolean;
};

export const TodoCreate: React.FC<Props> = React.memo(function TodoCreate({
  onAddTodo,
  sendError,
  todoList,
  isSubmitting,
  title,
  setTitle,
  onCompletingAll,
  isAllCompleted,
}) {
  const addRef = useRef<HTMLInputElement>(null);
  const [toggleState, setToggleState] = useState(isAllCompleted);

  useEffect(() => {
    setToggleState(isAllCompleted);
  }, [isAllCompleted]);

  useEffect(() => {
    if (addRef.current) {
      addRef.current.focus();
    }
  }, [title, isSubmitting, todoList]);

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();
    const newTitle = title.trim();

    if (newTitle) {
      await onAddTodo(newTitle);
    } else {
      sendError(ErrorType.EMPTY_TITLE);
    }
  };

  const onToggleAll = async () => {
    const updatedStatus = !toggleState;

    await onCompletingAll(updatedStatus);

    setToggleState(updatedStatus);
  };

  return (
    <header className="todoapp__header">
      {!!todoList.length && (
        <button
          type="button"
          className={classNames('todoapp__toggle-all', {
            active: isAllCompleted,
          })}
          data-cy="ToggleAllButton"
          onClick={onToggleAll}
        />
      )}
      <form method="POST" onSubmit={onSubmit}>
        <input
          ref={addRef}
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          autoFocus
          value={title}
          onChange={event => setTitle(event.target.value)}
          disabled={isSubmitting}
        />
      </form>
    </header>
  );
});
