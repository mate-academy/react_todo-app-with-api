import classNames from 'classnames';
import { RefObject, useEffect } from 'react';
import { Todo } from '../types/Todo';

type Props = {
  todos: Todo[],
  newTodo: RefObject<HTMLInputElement>,
  isAdding: boolean,
  addNewTodo: () => void,
  setTodo: (value: string) => void,
  todoToAdd: string,
  handleChangeToggleAll: () => void,
};

export const TodoField: React.FC<Props> = ({
  todos,
  newTodo,
  isAdding,
  addNewTodo,
  setTodo,
  todoToAdd,
  handleChangeToggleAll,
}) => {
  const completedTodos = todos
    .every((todo) => todo.completed === true);

  useEffect(() => {
    if (newTodo.current) {
      newTodo.current.focus();
    }
  }, [isAdding]);

  return (
    <header className="todoapp__header">
      {(todos.length !== 0) && (
        <button
          aria-label="ToggleAllButton"
          data-cy="ToggleAllButton"
          type="button"
          className={classNames(
            ('todoapp__toggle-all'),
            { active: completedTodos },
          )}
          onClick={handleChangeToggleAll}
        />
      )}

      <form
        onSubmit={(event) => {
          event.preventDefault();
          addNewTodo();
        }}
      >
        <input
          data-cy="NewTodoField"
          disabled={isAdding}
          type="text"
          ref={newTodo}
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={todoToAdd}
          onChange={(event) => setTodo(event.target.value)}
        />
      </form>
    </header>
  );
};
