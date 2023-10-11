import React, { useState } from 'react';
import cn from 'classnames';
import { ERROR_MESSAGES } from '../../utils/constants/ERROR_MESSAGES';
import { Todo } from '../../types/Todo';

type Props = {
  onTodoAdd: (todoTitle: string) => Promise<void>,
  setErrorMessage: (title: string) => void,
  textInputRef: React.RefObject<HTMLInputElement>,
  todos: Todo[],
  handleToogleAllButton: (todos: Todo[]) => void;
};

export const Header: React.FC<Props> = ({
  onTodoAdd,
  setErrorMessage,
  textInputRef,
  todos,
  handleToogleAllButton,
}) => {
  const [todoTitle, setTodoTitle] = useState('');

  const isAllTodosCompleted = todos.every(todoItem => todoItem.completed);
  const hasTodos = todos.length;

  const onTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTodoTitle(event.target.value);
  };

  const onFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const trimmedTodoTitle = todoTitle.trim();

    if (!trimmedTodoTitle) {
      setErrorMessage(ERROR_MESSAGES.titleShouldNotBeEmpty);

      return;
    }

    const currentTextInputRef = textInputRef.current;

    if (currentTextInputRef) {
      currentTextInputRef.disabled = true;
    }

    onTodoAdd(trimmedTodoTitle)
      .then(() => {
        setTodoTitle('');
      })
      .catch(() => {
        setErrorMessage(ERROR_MESSAGES.unableToAddTodo);
      })
      .finally(() => {
        if (currentTextInputRef) {
          currentTextInputRef.disabled = false;
          textInputRef.current.focus();
        }
      });
  };

  return (
    <header className="todoapp__header">
      {!!hasTodos && (
        <button
          aria-label="Toggle-All-Button"
          onClick={() => handleToogleAllButton(todos)}
          type="button"
          className={cn('todoapp__toggle-all', { active: isAllTodosCompleted })}
          data-cy="ToggleAllButton"
        />
      )}

      <form onSubmit={onFormSubmit}>
        <input
          disabled
          ref={textInputRef}
          value={todoTitle}
          onChange={onTitleChange}
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
        />
      </form>
    </header>
  );
};
