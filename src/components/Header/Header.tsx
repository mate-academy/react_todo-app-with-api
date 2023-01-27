import {
  FC,
  memo, useContext, useEffect,
  useRef,
  useState,
} from 'react';
import { Todo } from '../../types/Todo';
import { AuthContext } from '../Auth/AuthContext';

type Props = {
  isAddingTodo: boolean,
  showError: (message: string) => void,
  onAddTodo: (fieldsForCreate: Omit<Todo, 'id'>) => Promise<any>;
  toggleAll: () => void;
};

export const Header: FC<Props> = memo((props) => {
  const {
    onAddTodo,
    showError,
    toggleAll,
    isAddingTodo,
  } = props;

  const user = useContext(AuthContext);
  const newTodoField = useRef<HTMLInputElement>(null);

  const [title, setTitle] = useState('');

  useEffect(() => {
    if (newTodoField.current) {
      newTodoField.current.focus();
    }
  }, [isAddingTodo]);

  const onSubmit = async () => {
    if (!title) {
      showError('Title is required');

      return;
    }

    if (!user) {
      showError('User not found');

      return;
    }

    try {
      await onAddTodo({
        title,
        userId: user.id,
        completed: false,
      });
      setTitle('');
    } catch {
    /* empty */
    }
  };

  return (
    <header className="todoapp__header">
      {/* eslint-disable-next-line jsx-a11y/control-has-associated-label */}
      <button
        data-cy="ToggleAllButton"
        type="button"
        className="todoapp__toggle-all active"
        onClick={toggleAll}
      />

      <form onSubmit={(event) => {
        event.preventDefault();
        onSubmit();
      }}
      >
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
