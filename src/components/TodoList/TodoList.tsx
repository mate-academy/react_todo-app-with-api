import React from 'react';
import classNames from 'classnames';
import { Todo } from '../../types/Todo';
import { Loader } from '../Loader/Loader';
import { TodoInfo } from '../TodoInfo/TodoInfo';

type Props = {
  todos: Todo[]
  tempTodo: Todo | null
  isAdding: boolean
  onRemove: (todoId: number) => void
  onTodoUpdate: (todo: Todo) => void
  isUpdating: boolean
};

export const TodoList: React.FC<Props> = ({
  todos,
  tempTodo,
  isAdding,
  onRemove,
  onTodoUpdate,
  isUpdating,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => (
        <TodoInfo
          todo={todo}
          key={todo.id}
          onRemove={onRemove}
          onTodoUpdate={onTodoUpdate}
          isUpdating={isUpdating}
        />
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
              defaultChecked={tempTodo.completed}
            />
          </label>

          <span data-cy="TodoTitle" className="todo__title">
            {tempTodo.title}
          </span>

          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDeleteButton"
          >
            ×
          </button>

          <Loader isLoading={isAdding} />
        </div>
      )}
    </section>

  );
};
