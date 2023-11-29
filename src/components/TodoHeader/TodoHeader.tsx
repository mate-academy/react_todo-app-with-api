import cn from 'classnames';
import {
  useEffect, useRef, useState,
} from 'react';
import { Todo } from '../../types/Todo';

type Props = {
  errorNotification: (m: string) => void,
  isDisable: boolean,
  addTodo: (t: string, st: (t: string) => void) => void,
  todos: Todo[],
  updateTodo: (t: Todo) => void,
};

export const TodoHeader: React.FC<Props> = ({
  errorNotification,
  isDisable,
  addTodo,
  todos,
  updateTodo,
}) => {
  const [todoTitle, setTodoTitle] = useState('');
  const todoField = useRef<HTMLInputElement>(null);
  const isActiveToggleAll = todos.every(todo => todo.completed === true);

  useEffect(() => {
    if (todoField.current) {
      todoField.current.focus();
    }
  }, [isDisable]);

  const handleFormSubmit = (ev: React.FormEvent<HTMLFormElement>) => {
    ev.preventDefault();

    if (!todoTitle.trim()) {
      errorNotification('Title should not be empty');

      return;
    }

    addTodo(todoTitle, setTodoTitle);
  };

  const handleToggleAll = () => {
    todos.forEach(todo => todo.completed === isActiveToggleAll
      && updateTodo({ ...todo, completed: !isActiveToggleAll }));
  };

  return (
    <header className="todoapp__header">
      {todos.length > 0 && (
        <button
          type="button"
          className={cn('todoapp__toggle-all',
            { active: isActiveToggleAll })}
          data-cy="ToggleAllButton"
          aria-label="ToggleAll"
          onClick={handleToggleAll}
        />
      )}

      <form onSubmit={handleFormSubmit}>
        <input
          data-cy="NewTodoField"
          ref={todoField}
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          disabled={isDisable}
          value={todoTitle}
          onChange={(ev) => setTodoTitle(ev.target.value)}
        />
      </form>
    </header>
  );
};
