import React, {
  Dispatch,
  FormEvent,
  SetStateAction,
  useEffect,
  useState,
} from 'react';
import cn from 'classnames';

type Props = {
  isTodoListEmpty: boolean,
  isAnyTodoActive: boolean,
  isNewLoading: boolean,
  inputRef: React.RefObject<HTMLInputElement>,
  handleSubmit: (
    event: FormEvent<HTMLFormElement>,
    title: string,
    setTitle: Dispatch<SetStateAction<string>>,
  ) => void,
  handleToggleAll: () => void;
};

export const TodoHeader: React.FC<Props> = ({
  inputRef,
  isTodoListEmpty,
  isAnyTodoActive,
  isNewLoading,
  handleSubmit,
  handleToggleAll,
}) => {
  const [newTodoText, setNewTodoText] = useState('');

  useEffect(() => {
    if (inputRef.current && !inputRef.current.disabled) {
      inputRef.current.focus();
    }
  }, [inputRef]);

  return (
    <header className="todoapp__header">
      {!isTodoListEmpty && (
        <button
          aria-label="ToggleAllButton"
          type="button"
          className={cn('todoapp__toggle-all', {
            active: !isAnyTodoActive,
          })}
          data-cy="ToggleAllButton"
          onClick={handleToggleAll}
        />
      )}

      <form onSubmit={(event) => handleSubmit(
        event,
        newTodoText,
        setNewTodoText,
      )}
      >
        <input
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={newTodoText}
          onChange={(event) => setNewTodoText(event.target.value)}
          disabled={isNewLoading}
          ref={inputRef}
        />
      </form>
    </header>
  );
};
