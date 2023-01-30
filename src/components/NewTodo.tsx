import cn from 'classnames';
import {
  FC,
  memo,
  useState,
  useRef,
  useEffect,
  useContext,
} from 'react';
import { EditContext } from '../contexts/EditContext';
import { GlobalContext } from '../contexts/GlobalContext';

export const NewTodo: FC = memo(
  () => {
    const {
      isAdding,
      setNoError,
      onTitleSubmit,
    } = useContext(GlobalContext);

    const {
      isToggleAllActive,
      onToggleAll,
    } = useContext(EditContext);

    const TodoField = useRef<HTMLInputElement>(null);
    const [inputValue, setInputValue] = useState('');

    useEffect(() => {
      if (TodoField.current) {
        TodoField.current.focus();
      }
    }, [isAdding]);

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();

      onTitleSubmit(inputValue);
      setInputValue('');
    };

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      setInputValue(event.currentTarget.value);
      setNoError(true);
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
            value={inputValue}
            onChange={handleChange}
            disabled={isAdding}
          />
        </form>
      </header>
    );
  },
);
