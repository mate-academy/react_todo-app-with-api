import React, { useEffect, useRef, useState } from 'react';
import classNames from 'classnames';

type Props = {
  isTempTodoTrue: boolean,
  areAllTodosCompleted: boolean,
  isToggleAllButtonVisible: boolean,
  showErrorMessage: (message: string) => void,
  handleEnterKeyPress: (todoTitle: string) => void,
  onToggleAllButtonClick: () => void,
};

export const TodoHeader: React.FC<Props> = React.memo(({
  isTempTodoTrue,
  areAllTodosCompleted,
  isToggleAllButtonVisible,
  showErrorMessage,
  handleEnterKeyPress,
  onToggleAllButtonClick,
}) => {
  const [title, setTitle] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    return () => {
      if (inputRef.current) {
        inputRef.current.focus();
      }
    };
  }, [isTempTodoTrue]);

  const onInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const inputElement = event.target as HTMLInputElement;

    setTitle(inputElement.value);
  };

  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const normalizedTitle = title.trim();

    if (!normalizedTitle) {
      showErrorMessage('Title can\'t be empty');

      return;
    }

    handleEnterKeyPress(normalizedTitle);
    setTitle('');
  };

  return (
    <header className="todoapp__header">
      {isToggleAllButtonVisible && (
        <button
          type="button"
          className={classNames('todoapp__toggle-all', {
            active: areAllTodosCompleted,
          })}
          onClick={() => onToggleAllButtonClick()}
        />
      )}

      <form onSubmit={onSubmit}>
        <input
          type="text"
          value={title}
          ref={inputRef}
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          disabled={isTempTodoTrue}
          onChange={onInputChange}
        />
      </form>
    </header>
  );
});
