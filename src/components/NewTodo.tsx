import cn from 'classnames';
import {
  FC,
  memo,
  useState,
  useRef,
  useEffect,
} from 'react';

interface Props {
  // newTodoField: React.RefObject<HTMLInputElement>,
  isToggleAllActive: boolean
  isAdding: boolean
  onFocus: React.Dispatch<React.SetStateAction<boolean>>,
  onFormSubmit: (title: string) => void,
  onToggleAll: () => void
}

export const NewTodo: FC<Props> = memo(
  ({
    // newTodoField,
    isAdding,
    isToggleAllActive,
    onFocus,
    onFormSubmit,
    onToggleAll,
  }) => {
    const TodoField = useRef<HTMLInputElement>(null);
    const [inputValue, setInputValue] = useState('');

    useEffect(() => {
      if (TodoField.current) {
        TodoField.current.focus();
      }
    }, [isAdding]);

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
            ref={TodoField}
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
