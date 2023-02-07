/* eslint-disable jsx-a11y/control-has-associated-label */
import React, {
  memo,
  useContext,
  useState,
  useRef,
  useEffect,
} from 'react';
import cn from 'classnames';
import { ErorrMessage } from '../../types/enums';
import { Todo } from '../../types/Todo';
import { AuthContext } from '../Auth/AuthContext';

type Props = {
  todos: Todo[],
  onSubmit: (todoData: Omit<Todo, 'id'>) => Promise<void>,
  setIsError: (value: boolean) => void,
  showError: (value: ErorrMessage) => void,
  isAdding: boolean,
  updateTodo: (
    todoId: number,
    newData: Partial<Pick<Todo, 'title' | 'completed'>>,
  ) => Promise<void>,
};

export const Header: React.FC<Props> = memo(({
  todos,
  onSubmit,
  setIsError,
  showError,
  isAdding,
  updateTodo,
}) => {
  const [title, setTitle] = useState('');
  const user = useContext(AuthContext);
  const newTodoField = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // focus the element with `ref={newTodoField}`
    if (newTodoField.current) {
      newTodoField.current.focus();
    }
  }, [todos.length]);

  const completedTodos = todos.filter(todo => todo.completed === true);
  const isRequiredStatus = completedTodos.length !== todos.length;
  const isToggleCompletionActive = !isRequiredStatus;

  const toggleCompletionAlltodos = () => {
    todos.forEach(async (todo) => {
      if (todo.completed !== isRequiredStatus) {
        await updateTodo(todo.id, { completed: isRequiredStatus });
      }
    });
  };

  const handleFormSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    const IsValidTitle = title.trim().length > 0;

    if (!IsValidTitle) {
      showError(ErorrMessage.UNVALID_TITLE);

      return;
    }

    if (!user) {
      showError(ErorrMessage.UNVALID_USER);

      return;
    }

    onSubmit({
      userId: user.id,
      title,
      completed: false,
    });

    setTitle(() => '');
  };

  return (
    <header className="todoapp__header">
      {todos.length > 0 && (
        <button
          data-cy="ToggleAllButton"
          type="button"
          className={cn('todoapp__toggle-all', {
            active: isToggleCompletionActive,
          })}
          onClick={toggleCompletionAlltodos}
        />
      )}

      <form
        onSubmit={handleFormSubmit}
      >
        <input
          data-cy="NewTodoField"
          type="text"
          ref={newTodoField}
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          disabled={isAdding}
          value={title}
          onChange={(event) => {
            setIsError(false);
            setTitle(event.target.value);
          }}
        />
      </form>
    </header>
  );
});
