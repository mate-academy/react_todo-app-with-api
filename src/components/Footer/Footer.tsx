import classNames from 'classnames';
import React, { useMemo } from 'react';
import { Status } from '../../types/Status';
import { Todo } from '../../types/Todo';

type Props = {
  todos: Todo[]
  status: Status
  setStatus: (status: Status) => void;
  handleDeleteCompletedTodos: () => void;
};
export const Footer:React.FC<Props> = React.memo(({
  todos,
  status,
  setStatus,
  handleDeleteCompletedTodos,
}) => {
  const activeTodosAmount = useMemo(() => {
    return todos.filter(todo => !todo.completed).length;
  }, [todos]);
  const completedTodo = useMemo(() => {
    return todos.filter(todo => todo.completed);
  }, [todos]);

  return (
    <footer className="todoapp__footer">
      <span className="todo-count">
        {`${activeTodosAmount} items left`}
      </span>

      {/* Active filter should have a 'selected' class */}
      <nav className="filter">
        {Object.values(Status).map(item => {
          return (
            <a
              href={`#/${item}`}
              className={classNames(
                'filter__link', { selected: status === item },
              )}
              onClick={() => setStatus(item)}
              key={Math.random()}
            >
              {item}
            </a>
          );
        })}
      </nav>

      {/* don't show this button if there are no completed todos */}
      {!!completedTodo.length
       && (
         <button
           type="button"
           className="todoapp__clear-completed"
           onClick={handleDeleteCompletedTodos}
         >
           Clear completed
         </button>
       )}
    </footer>
  );
});
