import React, {
  Dispatch,
  FC,
  SetStateAction,
  useEffect,
  useRef,
  useState,
} from 'react';
import { ErrorType } from '../types/ErrorType';
import classNames from 'classnames';

type Props = {
  onAddTodo: (value: string) => Promise<void>;
  setErrorTodos: Dispatch<SetStateAction<ErrorType>>;
  onToggleAll: () => Promise<void>;
  isAllCompleted: boolean;
};

export const TodoHeader: FC<Props> = props => {
  const { onAddTodo, setErrorTodos, onToggleAll, isAllCompleted } = props;
  const [inputValue, setInputValue] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (inputValue.trim() === '') {
      setErrorTodos(ErrorType.EmptyTitle);

      return;
    }

    try {
      await onAddTodo(inputValue.trim());
      setInputValue('');
      setErrorTodos(ErrorType.Empty);
    } catch (err) {
      setErrorTodos(ErrorType.AddTodo);
    }
  };

  return (
    <header className="todoapp__header">
      <button
        type="button"
        className={classNames('todoapp__toggle-all', {
          active: isAllCompleted,
        })}
        data-cy="ToggleAllButton"
        onClick={onToggleAll}
      />
      <form onSubmit={onSubmit}>
        <input
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          ref={inputRef}
          value={inputValue}
          onChange={event => setInputValue(event.target.value)}
        />
      </form>
    </header>
  );
};
