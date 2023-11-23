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
}

export const Header: React.FC<Props> = ({
  todos,
  title,
  isDisable,
  setTitle,
  setErrorMessage,
  addTodo,
}) => {
  const field = useRef<HTMLInputElement>(null);
  const isToggleAll = todos.every(todo => todo.completed)

  useEffect(() => {
    if (field.current) {
      field.current.focus();
    }
  }, [isDisable]);

  const toggleAll = () => {

  }

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
      <button
        type="button"
        className={cn('todoapp__toggle-all', {
          'active': isToggleAll,
        })}
        data-cy="ToggleAllButton"
        onClick={toggleAll}
      />

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
