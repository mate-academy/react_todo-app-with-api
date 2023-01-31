import cn from 'classnames';
import React, {
  FormEvent,
  memo,
  useContext,
  useState,
} from 'react';
import { Todo } from '../../types/Todo';
import { AuthContext } from '../Auth/AuthContext';

type Props = {
  newTodoField: React.RefObject<HTMLInputElement>;
  showErrorMessage: (message: string) => void;
  isAddingTodo: boolean;
  onAddTodo: (fieldsForCreate: Omit<Todo, 'id'>) => void;
  userId?: number;
  shouldRenderActiveToggle: boolean;
  handleToggleTodosStatus: () => void;
};

export const NewTodos: React.FC<Props> = memo((props) => {
  const {
    newTodoField,
    showErrorMessage,
    isAddingTodo,
    onAddTodo,
    shouldRenderActiveToggle,
    handleToggleTodosStatus,
  } = props;
  const user = useContext(AuthContext);
  const [title, setTitle] = useState('');

  const handleForSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!title) {
      showErrorMessage('Title can\'t be empty');

      return;
    }

    if (!user) {
      showErrorMessage('User not found');

      return;
    }

    try {
      await onAddTodo({
        title,
        userId: user.id,
        completed: false,
      });

      setTitle('');
      // eslint-disable-next-line
    } catch { /*empty */ }
  };

  return (
    <header className="todoapp__header">
      {/* eslint-disable-next-line jsx-a11y/control-has-associated-label */}
      <button
        data-cy="ToggleAllButton"
        type="button"
        className={cn(
          'todoapp__toggle-all',
          { active: shouldRenderActiveToggle },
        )}
        onClick={handleToggleTodosStatus}
      />

      <form
        onSubmit={handleForSubmit}
      >
        <input
          data-cy="NewTodoField"
          type="text"
          disabled={isAddingTodo}
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          ref={newTodoField}
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
        />
      </form>
    </header>
  );
});
