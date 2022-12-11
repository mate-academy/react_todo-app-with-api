import classNames from 'classnames';
import React, {
  FormEvent, useEffect, useMemo, useRef,
} from 'react';
import { Todo } from '../../types/Todo';

type Props = {
  newTodoTitle: string;
  isAdding: boolean;
  todos: Todo[];
  setTempTodo: (todo: Todo) => void;
  setNewTodoTitle: (title: string) => void;
  add: (tempTodo: Todo) => void;
  toggle: (todo: Todo[]) => void;
};

export const Header = React.memo<Props>(({
  newTodoTitle,
  isAdding,
  todos,
  setTempTodo,
  setNewTodoTitle,
  add,
  toggle,
}) => {
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const tempTodo = {
      id: 0,
      userId: 5249,
      title: newTodoTitle,
      completed: false,
    };

    setTempTodo(tempTodo);

    add(tempTodo);
  };

  const notCompletedTodos = useMemo(() => {
    return [...todos].filter(todo => todo.completed === false);
  }, [todos]);

  const handleClick = () => {
    if (!notCompletedTodos.length) {
      toggle(todos);
    } else {
      toggle(notCompletedTodos);
    }
  };

  const handleChange = (value: string) => {
    setNewTodoTitle(value);
  };

  const newTodoField = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (newTodoField.current) {
      newTodoField.current.focus();
    }
  }, [isAdding]);

  return (
    <header className="todoapp__header">
      <button
        data-cy="ToggleAllButton"
        type="button"
        className={classNames(
          'todoapp__toggle-all',
          { active: notCompletedTodos.length === 0 },
        )}
        aria-label="label"
        onClick={handleClick}
      />

      <form onSubmit={(event) => handleSubmit(event)}>
        <input
          data-cy="NewTodoField"
          type="text"
          ref={newTodoField}
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={newTodoTitle}
          onChange={(event) => handleChange(event.target.value)}
          disabled={isAdding}
        />
      </form>
    </header>
  );
});
