/* eslint-disable jsx-a11y/control-has-associated-label */

import classNames from 'classnames';
import { useCallback, useEffect, useRef } from 'react';

type Props = {
  title: string,
  changeTitle: (value: string) => void,
  onSetTitleError?: () => void,
  isAdding?: boolean,
  onSetIsEditing?: (isEdit: boolean) => void,
  onSubmit: () => void,
};

export const NewTodoField: React.FC<Props> = (
  {
    onSetTitleError,
    title,
    changeTitle,
    onSetIsEditing,
    isAdding,
    onSubmit,
  },
) => {
  const newTodoField = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (newTodoField.current) {
      newTodoField.current.focus();
    }
  }, []);

  useEffect(() => {
    if (newTodoField.current) {
      newTodoField.current.focus();
    }
  }, [isAdding]);

  const addNewTodo = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSubmit();
  };

  const handleChangeTitle = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    if (onSetTitleError) {
      onSetTitleError();
    }

    changeTitle(event.target.value);
  };

  const onEscapeClick = useCallback((event: React.KeyboardEvent) => {
    if (event.code === 'Escape' && onSetIsEditing) {
      onSetIsEditing(false);
      changeTitle(title);
    }
  }, []);

  const onBlur = () => {
    if (onSetIsEditing) {
      onSubmit();
    }
  };

  return (
    <form
      onSubmit={addNewTodo}
    >
      <input
        data-cy="NewTodoField"
        type="text"
        ref={newTodoField}
        className={classNames('todoapp__new-todo', {
          'todoapp__update-todo-title': onSetIsEditing,
        })}
        placeholder={onSetIsEditing
          ? 'Empty todo will be deleted'
          : 'What needs to be done?'}
        value={title}
        onChange={handleChangeTitle}
        disabled={isAdding}
        onKeyDown={onEscapeClick}
        onBlur={onBlur}
      />
    </form>
  );
};
