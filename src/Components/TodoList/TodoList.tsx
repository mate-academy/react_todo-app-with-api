import { useContext, useMemo } from 'react';

import classNames from 'classnames';
import { TodoItem } from '../TodoItem';

import { Context } from '../../Context';
import { Filter } from '../../types/Filter';

export const Main = () => {
  const {
    todos,
    filter,
    tempTodo,
  } = useContext(Context);

  const { title, completed } = tempTodo || {};

  const filteredTodos = useMemo(() => {
    if (filter === Filter.ACTIVE) {
      return todos.filter((item) => !item.completed);
    }

    if (filter === Filter.COMPLETED) {
      return todos.filter((item) => item.completed);
    }

    return todos;
  }, [filter, todos]);

  return (
    <section className="todoapp__main" data-cy="TodoList">

      {filteredTodos?.map(todo => (
        <TodoItem todo={todo} key={todo.id} />
      ))}

      {tempTodo && (
        <div
          data-cy="Todo"
          className={classNames('todo', {
            completed,
          })}
        >
          <label className="todo__status-label">
            <input
              data-cy="TodoStatus"
              type="checkbox"
              className="todo__status"
              checked={completed}
            />
          </label>

          <span data-cy="TodoTitle" className="todo__title">
            {title}
          </span>

          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
          >
            ×
          </button>

          <div
            data-cy="TodoLoader"
            className="modal overlay is-active"
          >
            <div className="modal-background has-background-white-ter" />
            <div className="loader" />
          </div>
        </div>
      )}
    </section>
  );
};
