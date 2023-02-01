import {
  FC, FormEvent,
  memo, useContext, useEffect,
  useRef,
  useState,
} from 'react';
import cn from 'classnames';
import { Todo } from '../../types/Todo';
import { AuthContext } from '../Auth/AuthContext';

type Props = {
  isAddingTodo: boolean,
  showError: (message: string) => void,
  onAddTodo: (fieldsForCreate: Omit<Todo, 'id'>) => Promise<void>;
  handleToggleTodosStatus: () => void;
  shouldRenderActiveToggle: boolean,
};

export const Header: FC<Props> = memo((props) => {
  const {
    onAddTodo,
    showError,
    shouldRenderActiveToggle,
    isAddingTodo,
    handleToggleTodosStatus,
  } = props;

  const user = useContext(AuthContext);
  const newTodoField = useRef<HTMLInputElement>(null);

  const [title, setTitle] = useState('');

  useEffect(() => {
    if (newTodoField.current) {
      newTodoField.current.focus();
    }
  }, [isAddingTodo]);

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!title) {
      showError('Title is required');

      return;
    }

    if (!user) {
      showError('User not found');

      return;
    }

    await onAddTodo({
      title,
      userId: user.id,
      completed: false,
    });
    setTitle('');
  };

  return (
    <header className="todoapp__header">
      {/* eslint-disable-next-line jsx-a11y/control-has-associated-label */}
      <button
        data-cy="ToggleAllButton"
        type="button"
        className={cn('todoapp__toggle-all',
          { active: shouldRenderActiveToggle })}
        onClick={handleToggleTodosStatus}
      />

      <form onSubmit={onSubmit}>
        <input
          data-cy="NewTodoField"
          type="text"
          ref={newTodoField}
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          disabled={isAddingTodo}
        />
      </form>
    </header>
  );
});
