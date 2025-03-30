import { useState, useEffect, useRef } from 'react';
import { Todo } from '../../types/Todo';
import classNames from 'classnames';

type Props = {
  onAdd: (title: string) => void;
  adding: boolean;
  errorMessage: string | null;
  todos: Todo[];
  onUpdate: (el: Todo[]) => void;
};

export const Header: React.FC<Props> = ({
  onAdd,
  adding,
  errorMessage,
  todos,
  onUpdate,
}) => {
  const [title, setTitle] = useState('');
  const inputFocused = useRef<null | HTMLInputElement>(null);

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    onAdd(title.trim());
  };

  useEffect(() => {
    if ((errorMessage?.length ?? 0) === 0 && !adding) {
      setTitle('');
    }

    inputFocused.current?.focus();
  }, [adding, todos.length, errorMessage]);

  useEffect(() => {
    inputFocused.current?.focus();
  }, []);

  const completedTodos = todos.filter(todo => todo.completed);

  const changeAllCompleted = () => {
    const areAllCompleted = todos.every(td => td.completed);
    const updatedTodos = todos
      .filter(todo => todo.completed === areAllCompleted)
      .map(td => ({
        ...td,
        completed: !areAllCompleted,
      }));

    if (updatedTodos.length > 0) {
      onUpdate(updatedTodos);
    }
  };

  return (
    <header className="todoapp__header">
      {todos.length > 0 && (
        <button
          type="button"
          className={classNames('todoapp__toggle-all', {
            active: completedTodos.length === todos.length,
          })}
          data-cy="ToggleAllButton"
          onClick={changeAllCompleted}
        />
      )}

      <form onSubmit={onSubmit}>
        <input
          disabled={adding}
          ref={inputFocused}
          data-cy="NewTodoField"
          type="text"
          value={title}
          onChange={e => setTitle(e.target.value)}
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
        />
      </form>
    </header>
  );
};
