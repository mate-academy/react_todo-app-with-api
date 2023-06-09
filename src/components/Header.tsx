/* eslint-disable jsx-a11y/control-has-associated-label */
import { useMemo, useState } from 'react';
import classNames from 'classnames';
import { Todo } from '../types/Todo';

type Props = {
  todos: Todo[];
  onAddTodo: (title: string) => void;
  isCreating: boolean;
  onToggleAll: () => void;
};

export const Header: React.FC<Props> = ({
  todos,
  onAddTodo,
  isCreating,
  onToggleAll,
}) => {
  const [todoTitle, setTodoTitle] = useState('');

  const allTodosCompleted = useMemo(() => {
    return todos.every(todo => todo.completed);
  }, [todos]);

  const handleFormSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    onAddTodo(todoTitle);

    setTodoTitle('');
  };

  const handleChangeTitle = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;

    setTodoTitle(value);
  };

  return (
    <header className="todoapp__header">
      {!!todos.length && (
        <button
          type="button"
          className={classNames(
            'todoapp__toggle-all',
            { active: allTodosCompleted },
          )}
          onClick={onToggleAll}
        />
      )}

      <form onSubmit={handleFormSubmit}>
        <input
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={todoTitle}
          onChange={handleChangeTitle}
          disabled={isCreating}
        />
      </form>
    </header>
  );
};
