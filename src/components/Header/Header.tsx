import { useContext } from 'react';
import { TodoContext } from '../../TodoContext';
import classNames from 'classnames';

export const Header: React.FC = () => {
  const {
    todos,
    title,
    setTitle,
    handleSubmit,
    titleField,
    isLoading,
    handleAllCompleted,
  } = useContext(TodoContext);

  return (
    <header className="todoapp__header">
      {todos.length > 0 && (
        <button
          type="button"
          className={classNames('todoapp__toggle-all', {
            active: todos.every(todo => todo.completed),
          })}
          data-cy="ToggleAllButton"
          onClick={handleAllCompleted}
        />
      )}

      <form onSubmit={handleSubmit}>
        <input
          data-cy="NewTodoField"
          type="text"
          ref={titleField}
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={title}
          disabled={isLoading}
          onChange={event => setTitle(event.target.value)}
        />
      </form>
    </header>
  );
};
