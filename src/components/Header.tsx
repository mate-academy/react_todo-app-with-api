import { useEffect, useRef } from 'react';
import cn from 'classnames';
import { Error } from '../types/Error';
import { Todo } from '../types/Todo';

/* eslint-disable jsx-a11y/control-has-associated-label */
interface Props {
  todos: Todo[],
  title: string,
  isDisable: boolean,
  setTitle: (value: string) => void,
  setErrorMessage: (message: Error | '') => void,
  addTodo: (v: string) => void,
  updateTodo: (todo: Todo) => void,
}

export const Header: React.FC<Props> = ({
  todos,
  title,
  isDisable,
  setTitle,
  setErrorMessage,
  addTodo,
  updateTodo,
}) => {
  const field = useRef<HTMLInputElement | null>(null);
  const isToggleAll = todos.every(todo => todo.completed);

  useEffect(() => {
    if (field.current) {
      field.current.focus();
    }
  }, [isDisable, todos.length]);

  const toggleAll = () => {
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    isToggleAll
      ? todos.forEach(todo => updateTodo({ ...todo, completed: false }))
      : todos.forEach(todo => !todo.completed
        && updateTodo({ ...todo, completed: true }));
  };

  const handleSubmitTodo = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!title.trim()) {
      setErrorMessage(Error.TitleEmpty);

      setTimeout(() => {
        setErrorMessage('');
      }, 3000);

      return;
    }

    addTodo(title);
  };

  return (
    <header className="todoapp__header">
      {!!todos.length && (
        <button
          type="button"
          className={cn('todoapp__toggle-all', {
            active: isToggleAll,
          })}
          data-cy="ToggleAllButton"
          aria-label="ToggleAll"
          onClick={toggleAll}
        />
      )}

      <form
        onSubmit={handleSubmitTodo}
      >
        <input
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          ref={field}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          disabled={isDisable}
        />
      </form>
    </header>
  );
};
