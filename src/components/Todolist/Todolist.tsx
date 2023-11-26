import React from 'react';
import cn from 'classnames';
import { Todo } from '../../types/Todo';
import { Todoitem } from '../Todoitem/Todoitem';
/* eslint-disable max-len */
/* eslint-disable */
interface Props {
  displayTodos: Todo[],
  temptodo?: Todo | null,
  setTodos: (newTodos: Todo[] | ((prevValue: Todo[]) => Todo[])) => void,
  todos: Todo[],
  setError: (value: string) => void
  cleared: boolean
  toggled: string
  titleField: React.MutableRefObject<HTMLInputElement | null>;
}

export const Todolist: React.FC<Props> = ({
  displayTodos,
  temptodo,
  setTodos,
  todos,
  setError,
  cleared,
  toggled,
  titleField,
}) => {
  return (
    <>
      <section className="todoapp__main" data-cy="TodoList">

        {displayTodos.map(todo => (

          <Todoitem
            key={todo.id}
            todo={todo}
            todos={todos}
            setTodos={setTodos}
            setError={setError}
            cleared={cleared}
            toggled={toggled}
            titleField={titleField}

          />

        ))}
        {temptodo && (
          <div
            data-cy="Todo"
            className={cn('todo', { completed: temptodo?.completed })}
            key={temptodo?.id}
          >
            <label className="todo__status-label">
              <input
                data-cy="TodoStatus"
                type="checkbox"
                className="todo__status"
                checked={Boolean(temptodo?.completed)}
              />
            </label>

            <span data-cy="TodoTitle" className="todo__title">
              {temptodo?.title.trim()}
            </span>

            {/* Remove button appears only on hover */}
            <button type="button" className="todo__remove" data-cy="TodoDelete">
              ×
            </button>

            <div data-cy="TodoLoader" className="modal overlay is-active">
              <div className="modal-background has-background-white-ter" />
              <div className="loader" />
            </div>

          </div>
        )}

      </section>
    </>
  );
};
