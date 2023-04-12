import {
  FC,
  useState,
  useEffect,
  Dispatch,
  SetStateAction,
  ChangeEvent,
  FormEvent,
  useRef,
} from 'react';
import classNames from 'classnames';
import { Todo } from '../../types/Todo';
import { Errors } from '../../types/Errors';

type Props = {
  areAnyTodos: boolean,
  userId: number,
  isInputDisabled: boolean,
  allCompleted: boolean,
  onSubmit: (todoData: Omit<Todo, 'id'>) => Promise<void>,
  onToggleAll: () => void,
  setError: Dispatch<SetStateAction<Errors>>,
};

export const AddingForm: FC<Props> = ({
  areAnyTodos,
  userId,
  isInputDisabled,
  allCompleted,
  onSubmit,
  onToggleAll,
  setError,
}) => {
  const [title, setTitle] = useState('');

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    if (!title.trim()) {
      setError(Errors.TITLE_ERROR);

      return;
    }

    await onSubmit({
      title,
      completed: false,
      userId,
    });

    setTitle('');
  };

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value);
  };

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [isInputDisabled]);

  return (
    <header className="todoapp__header">
      {areAnyTodos && (
        <button
          type="button"
          className={classNames(
            'todoapp__toggle-all',
            { active: allCompleted },
          )}
          aria-label="make all todos active"
          onClick={onToggleAll}
        />
      )}

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={title}
          onChange={handleChange}
          disabled={isInputDisabled}
          ref={inputRef}
        />
      </form>
    </header>
  );
};
