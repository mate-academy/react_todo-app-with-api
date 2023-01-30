import React, {
  FormEvent,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import cn from 'classnames';
import { TodoErrors } from '../../types/Errors';
import { Todo } from '../../types/Todo';
import { AuthContext } from '../Auth/AuthContext';

type Props = {
  showError: (message: string) => void,
  isAdding: boolean,
  addTodo: (fieldsForCreate: Omit<Todo, 'id'>) => Promise<void>,
  toggleAll: () => void,
  isActiveToggleAll: boolean,
};

export const Header: React.FC<Props> = React.memo(({
  showError,
  isAdding,
  addTodo,
  toggleAll,
  isActiveToggleAll,
}) => {
  const [title, setTitle] = useState('');
  const newTodoField = useRef<HTMLInputElement>(null);
  const user = useContext(AuthContext);

  useEffect(() => {
    if (newTodoField.current) {
      newTodoField.current.focus();
    }
  }, [isAdding]);

  const handleFormSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!title) {
      showError(TodoErrors.TitleCantBeEmpty);

      return;
    }

    if (!user) {
      showError(TodoErrors.UserNotFound);

      return;
    }

    try {
      await addTodo({
        title,
        userId: user.id,
        completed: false,
      });

      setTitle('');
    } catch {
      showError(TodoErrors.UnableToAdd);
    }
  };

  return (
    <header className="todoapp__header">
      {/* eslint-disable-next-line jsx-a11y/control-has-associated-label */}
      <button
        data-cy="ToggleAllButton"
        type="button"
        className={cn('todoapp__toggle-all', { active: isActiveToggleAll })}
        onClick={toggleAll}
      />

      <form
        onSubmit={handleFormSubmit}
      >
        <input
          disabled={isAdding}
          data-cy="NewTodoField"
          type="text"
          ref={newTodoField}
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
        />
      </form>
    </header>
  );
});
