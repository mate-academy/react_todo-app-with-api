/* eslint-disable jsx-a11y/control-has-associated-label */
import {
  memo,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import cn from 'classnames';
import { Todo } from '../../types/Todo';
import { AuthContext } from '../Auth/AuthContext';
import { Errors } from '../../types/Errors';

interface Props {
  onAddTodo: (fieldsForCreate: Omit<Todo, 'id'>) => Promise<void>,
  showError: (message: string) => void,
  changeAllTodos: () => void,
  isAllTodosCompleted: boolean,
  isAddingTodo: boolean,
}

export const Header: React.FC<Props> = memo(({
  onAddTodo,
  showError,
  changeAllTodos,
  isAllTodosCompleted,
  isAddingTodo,
}) => {
  const user = useContext(AuthContext);
  const newTodoField = useRef<HTMLInputElement>(null);

  const [newTodoTitle, setNewTodoTitle] = useState('');

  useEffect(() => {
    if (newTodoField.current) {
      newTodoField.current.focus();
    }
  }, [isAddingTodo]);

  const submitForm = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!newTodoTitle.trim()) {
      showError(Errors.TitleCantBeEmpty);

      return;
    }

    if (!user) {
      showError(Errors.UserNotFound);

      return;
    }

    try {
      await onAddTodo({
        title: newTodoTitle,
        userId: user.id,
        completed: false,
      });

      setNewTodoTitle('');
    } catch { /* empty */ }
  };

  return (
    <header className="todoapp__header">
      <button
        data-cy="ToggleAllButton"
        type="button"
        className={cn(
          'todoapp__toggle-all',
          { active: isAllTodosCompleted },
        )}
        onClick={changeAllTodos}
      />

      <form onSubmit={submitForm}>
        <input
          data-cy="NewTodoField"
          type="text"
          ref={newTodoField}
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={newTodoTitle}
          onChange={(event) => setNewTodoTitle(event.target.value)}
          disabled={isAddingTodo}
        />
      </form>
    </header>
  );
});
