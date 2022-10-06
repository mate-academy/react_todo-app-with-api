import { RefObject } from 'react';
import classNames from 'classnames';

import { Todo } from '../../types/Todo';

type Props = {
  handleSubmit: (event: React.FormEvent<HTMLFormElement>) => void,
  newTodoField: RefObject<HTMLInputElement>,
  title: string,
  isAdding: boolean,
  setTitle: (todoText: string) => void,
  changeStatusAll: () => void
  todos: Todo[]
};

export const Header: React.FC<Props> = ({
  handleSubmit,
  newTodoField,
  title,
  isAdding,
  setTitle,
  changeStatusAll,
  todos,
}) => {
  // console.log(todos.filter(todo => todo.completed).length, todos.filter(todo => todo.completed));
  // может every метод?
  // const completedTodosLen = todos.filter(todo => todo.completed).length;
  const completedTodosAll = todos.every(todo => todo.completed);

  // console.log(completedTodosLen);

  return (
    <header className="todoapp__header">
      <button
        aria-label="make all todos active or vice versa"
        data-cy="ToggleAllButton"
        type="button"
        // className="todoapp__toggle-all active"
        className={classNames('todoapp__toggle-all', {
          active: completedTodosAll,
          // active: completedTodosLen !== 0 || completedTodosLen < 0,
        })}
        // было просто тру
        onClick={() => changeStatusAll()}
        // onClick={() => changeStatusAll(todos.map(todo => todo.completed))}
      />

      <form onSubmit={handleSubmit}>
        <input
          data-cy="NewTodoField"
          type="text"
          ref={newTodoField}
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          disabled={isAdding}
        />
      </form>
    </header>
  );
};
