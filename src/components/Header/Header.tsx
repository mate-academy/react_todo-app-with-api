import React, {
  useContext,
  useEffect,
  useState,
  useRef,
  memo,
} from 'react';
import classNames from 'classnames';
import { TodoAppContext } from '../../TodoAppContext';

export const Header: React.FC = memo(() => {
  const {
    todos,
    complet,
    addTodo,
    setComplet,
  } = useContext(TodoAppContext);
  const newTodoField = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState('');

  useEffect(() => {
    if (newTodoField.current && todos.length) {
      newTodoField.current.focus();
    }
  }, []);

  const handleSubmitForm = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    addTodo(query);
    setQuery('');
  };

  const handleChangeQuery = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };

  return (
    <header className="todoapp__header">
      {todos.length > 0 && (
        // eslint-disable-next-line jsx-a11y/control-has-associated-label
        <button
          data-cy="ToggleAllButton"
          type="button"
          className={classNames('todoapp__toggle-all', {
            active: todos.every(todo => todo.completed) && todos.length,
          })}
          onClick={() => setComplet(!complet)}
        />
      )}
      <form onSubmit={handleSubmitForm}>
        <input
          data-cy="NewTodoField"
          type="text"
          ref={newTodoField}
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={query}
          onChange={handleChangeQuery}
        />
      </form>
    </header>
  );
});
