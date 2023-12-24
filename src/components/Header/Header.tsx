import cn from 'classnames';
import {
  useContext, useEffect, useRef, useState,
} from 'react';
import { AppContext } from '../TodoContext/TodoContext';
import { ErrorType } from '../../types/ErrorType';

type Props = {
  isEveryTodosCompleted: boolean;
};

export const Header: React.FC<Props> = ({ isEveryTodosCompleted }) => {
  const {
    todoTitle, setTodoTitle, addTodo, setError, loading, todos, setTodos,
  }
    = useContext(AppContext);

  const [isChecked, setIsChecked] = useState(
    todos.every((todo) => todo.completed),
  );

  const fieldRender = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (todos.every((todo) => todo.completed)) {
      setIsChecked(true);
    } else {
      setIsChecked(false);
    }
  }, [todos]);

  const handleToggleAllChange = () => {
    if (isChecked) {
      setIsChecked(false);
    } else {
      setIsChecked(true);
    }

    setTodos(todos.map((todo) => ({ ...todo, completed: !isChecked })));
  };

  useEffect(() => {
    if (fieldRender.current && !fieldRender.current.disabled) {
      fieldRender.current.focus();
    }
  });

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event?.preventDefault();
    if (!todoTitle.trim()) {
      setError(ErrorType.titleIsEmpty);

      setTimeout(() => setError(null), 2000);

      return;
    }

    addTodo(todoTitle.trim());
  };

  return (
    <header className="todoapp__header">
      <button
        type="button"
        className={cn('todoapp__toggle-all text-invisible', {
          active: isEveryTodosCompleted,
        })}
        data-cy="ToggleAllButton"
        onClick={handleToggleAllChange}
      >
        {' '}
      </button>

      <form onSubmit={handleSubmit}>
        <input
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          ref={fieldRender}
          value={todoTitle}
          onChange={(e) => setTodoTitle(e.target.value)}
          disabled={loading}
        />
      </form>
    </header>
  );
};
