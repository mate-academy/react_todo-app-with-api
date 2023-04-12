import classNames from 'classnames';
import { useState } from 'react';

interface Props {
  hasTodos: boolean;
  hasActiveTodos: boolean;
  addTodo: (title: string) => Promise<void>;
  toggleAllTodos: () => Promise<void>;
}

export const Header: React.FC<Props> = ({
  hasTodos,
  hasActiveTodos,
  addTodo,
  toggleAllTodos,
}) => {
  const [todoTitle, setTodoTitle] = useState('');
  const [addingDisabled, setAddingDisabled] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const trimmedTodoTitle = todoTitle.trim();

    if (trimmedTodoTitle) {
      setAddingDisabled(true);
      await addTodo(trimmedTodoTitle);
      setAddingDisabled(false);
      setTodoTitle('');
    }
  };

  return (
    <header className="todoapp__header">
      <button
        type="button"
        className={classNames('todoapp__toggle-all', {
          active: hasActiveTodos,
          'is-invisible': !hasTodos,
        })}
        onClick={toggleAllTodos}
        aria-label={' '}
      />

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={todoTitle}
          onChange={(event) => setTodoTitle(event.target.value)}
          disabled={addingDisabled}
        />
      </form>
    </header>
  );
};
