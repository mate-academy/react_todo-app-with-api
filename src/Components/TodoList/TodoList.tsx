import { useContext, useMemo } from 'react';

import { TodoItem } from '../TodoItem';

import { Context } from '../../Context';
import { Filter } from '../../types/Filter';
import classNames from 'classnames';

export const Main = () => {
  const {
    todos,
    filter,
    tempTodo,
  } = useContext(Context);

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
            completed: tempTodo.completed,
          })}
        >
          <label className="todo__status-label">
            <input
              data-cy="TodoStatus"
              type="checkbox"
              className="todo__status"
              checked={tempTodo.completed}
            />
          </label>

          <span data-cy="TodoTitle" className="todo__title">
            {tempTodo.title}
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
