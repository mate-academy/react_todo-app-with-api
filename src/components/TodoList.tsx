import classNames from 'classnames';
import React from 'react';

import { Todo } from '../types/Todo';
import { EditForm } from './EditForm';

type Props = {
  todos: Todo[]
  deleteTodo: (id:number) => void
  tempTodo: Todo | null
  toggleCheckBox: (id:number, completed: boolean) => void
  toggleLoad: { isLoading: boolean, id: number }
  toggleAllLoad: boolean
  renameTodo: (todo:Todo, newTitle: string) => Promise<void>
};

export const TodoList: React.FC <Props> = ({
  todos,
  deleteTodo,
  tempTodo,
  toggleCheckBox,
  toggleLoad,
  toggleAllLoad,
  renameTodo,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => (
        <div
          key={todo.id}
          data-cy="Todo"
          className={classNames('todo', { completed: todo.completed })}
        >
          <label className="todo__status-label">
            <input
              onClick={() => {
                toggleCheckBox(todo.id, todo.completed);
              }}
              data-cy="TodoStatus"
              type="checkbox"
              className="todo__status"
              checked={todo.completed}
            />
          </label>

          <EditForm
            todo={todo}
            deleteTodo={deleteTodo}
            renameTodo={newTitle => renameTodo(todo, newTitle)}
            toggleLoad={toggleLoad}
            toggleAllLoad={toggleAllLoad}

          />

        </div>
      ))}

      {!!tempTodo && (
        <div data-cy="Todo" className="todo">
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
  );
};
