import cn from 'classnames';
import { FC, memo, useState } from 'react';

interface Props {
  newTodoField: React.RefObject<HTMLInputElement>,
  isToggleAllActive: boolean
  isAdding: boolean
  onFocus: React.Dispatch<React.SetStateAction<boolean>>,
  onFormSubmit: (title: string) => void,
  onToggleAll: () => void
}

export const NewTodo: FC<Props> = memo(
  ({
    isAdding,
    newTodoField,
    isToggleAllActive,
    onFocus,
    onFormSubmit,
    onToggleAll,
  }) => {
    const [inputValue, setInputValue] = useState('');

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();

      onFormSubmit(inputValue);
      setInputValue('');
    };

    return (
      <header className="todoapp__header">
        {/* eslint-disable-next-line jsx-a11y/control-has-associated-label */}
        <button
          data-cy="ToggleAllButton"
          type="button"
          className={cn({
            'todoapp__toggle-all': true,
            active: isToggleAllActive,
          })}
          onClick={onToggleAll}
        />

        <form onSubmit={handleSubmit}>
          <input
            data-cy="NewTodoField"
            type="text"
            ref={newTodoField}
            className="todoapp__new-todo"
            placeholder="What needs to be done?"
            onFocus={() => onFocus(true)}
            value={inputValue}
            onChange={(event) => setInputValue(event.currentTarget.value)}
            disabled={isAdding}
          />
        </form>
      </header>
    );
  },
);
