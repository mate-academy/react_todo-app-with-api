import cn from 'classnames';
import { useAppContext } from '../Context/AppContext';

export const Header = () => {
  const {
    todos,
    tempTodo,
    todoTitle,
    onTodoTitleChange,
    handleToggleAllTodos,
    handleHeaderFormSubmit,
  } = useAppContext();

  return (
    <header className="todoapp__header">
      {/* eslint-disable-next-line jsx-a11y/control-has-associated-label */}
      <button
        type="button"
        className={cn('todoapp__toggle-all', {
          active: todos.every(todo => todo.completed) && todos.length,
        })}
        onClick={handleToggleAllTodos}
        disabled={todos.length === 0}
      />

      <form onSubmit={handleHeaderFormSubmit}>
        <input
          type="text"
          value={todoTitle}
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          onChange={(event) => onTodoTitleChange(event.target.value)}
          disabled={tempTodo !== null}
        />
      </form>
    </header>
  );
};
