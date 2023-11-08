/* eslint-disable jsx-a11y/control-has-associated-label */
import { FC, useEffect, useRef } from 'react';
import cn from 'classnames';
import { Todo } from '../../types/Todo';
import { updateTodo } from '../../api/todos';
import { Filters } from '../../types/Filters';

type Props = {
  todos: Todo[];
  title: string,
  setTitle: (val: string) => void;
  onHandleSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  response: boolean;
  setTodos: (val: Todo[]) => void;
  setFilterBy: (val: Filters) => void;
};

export const Header: FC<Props> = ({
  todos,
  title,
  setTitle,
  onHandleSubmit,
  response,
  setTodos,
  setFilterBy,
}) => {
  const inputField = useRef<HTMLInputElement>(null);
  const allTodosCompleted = todos.every(todo => todo.completed);

  const handleToggleAll = () => {
    if (allTodosCompleted) {
      setFilterBy(Filters.Reversed);
      const newFalsyTodos = todos.map(todo => ({
        ...todo,
        completed: false,
      }));

      setTodos(newFalsyTodos);
      newFalsyTodos.forEach(todo => updateTodo(todo));
    } else {
      setFilterBy(Filters.Reversed);
      const newTrulyTodos = todos.map(currTodo => ({
        ...currTodo,
        completed: true,
      }));

      setTodos(newTrulyTodos);
      newTrulyTodos
        .forEach(trulyTodo => updateTodo({ ...trulyTodo, completed: true }));
    }
  };

  useEffect(() => {
    if (inputField.current) {
      inputField.current.focus();
    }
  }, [response, todos.length]);

  return (
    <header className="todoapp__header">
      {!!todos.length && (
        <button
          type="button"
          className={cn('todoapp__toggle-all', {
            active: allTodosCompleted,
          })}
          data-cy="ToggleAllButton"
          aria-label="Toggle All"
          onClick={handleToggleAll}
        />
      )}

      <form
        method="POST"
        onSubmit={onHandleSubmit}
      >
        <input
          data-cy="NewTodoField"
          ref={inputField}
          value={title}
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          disabled={response}
          onChange={e => setTitle(e.target.value)}
        />
      </form>
    </header>
  );
};
