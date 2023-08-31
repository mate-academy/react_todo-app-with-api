import {
  FC,
  useState,
  useEffect,
  useCallback,
  ChangeEvent,
  FormEvent,
  useRef,
} from 'react';
import classNames from 'classnames';
import { Todo } from '../../Types/Todos';
import { Errors } from '../../Types/Errors';

type Props = {
  isTodoListEmpty: boolean,
  userId: number,
  isInputDisabled: boolean,
  allCompleted: boolean,
  onSubmit: (todoData: Omit<Todo, 'id'>) => Promise<void>,
  onToggleAll: () => void,
  onError: (errors: Errors) => void,
};

export const AddingForm: FC<Props> = ({
  isTodoListEmpty,
  userId,
  isInputDisabled,
  allCompleted,
  onSubmit,
  onToggleAll,
  onError,
}) => {
  const [title, setTitle] = useState('');

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    if (!title.trim()) {
      onError(Errors.TITLE_ERROR);

      return;
    }

    await onSubmit({
      title,
      completed: false,
      userId,
    });

    setTitle('');
  };

  const handleChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value);
  }, []);

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (inputRef.current && !isInputDisabled) {
      inputRef.current.focus();
    }
  }, [isInputDisabled]);

  return (
    <header className="todoapp__header">
      {!isTodoListEmpty && (
        <button
          type="button"
          className={classNames(
            'todoapp__toggle-all',
            { active: allCompleted },
          )}
          aria-label="mark all todos as active"
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
