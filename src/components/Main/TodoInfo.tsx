import React, { memo, useState } from 'react';
import cn from 'classnames';
import { Todo } from '../../types/Todo';
import { TodoTitleField } from './TodoTitleField';

type Props = {
  todo: Todo,
  deleteTodo: (value: number) => Promise<void>,
  deletingTodoIds: number[],
  updateTodo: (
    todoId: number,
    newData: Partial<Pick<Todo, 'title' | 'completed'>>,
  ) => Promise<void>,
  updatingTodoIds: number[],
};

export const TodoInfo: React.FC<Props> = memo(({
  todo,
  deleteTodo,
  deletingTodoIds,
  updateTodo,
  updatingTodoIds,
}) => {
  const [isTitleUpdating, setIsTitleUpdating] = useState(false);

  return (
    <div
      data-cy="Todo"
      className={cn(
        'todo',
        { completed: todo.completed },
      )}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          readOnly
          onClick={() => updateTodo(
            todo.id, { completed: !todo.completed },
          )}
        />
      </label>

      {isTitleUpdating
        ? (
          <TodoTitleField
            todoId={todo.id}
            updateTodo={updateTodo}
            prevTitle={todo.title}
            setIsTitleUpdating={setIsTitleUpdating}
            deleteTodo={deleteTodo}
          />
        )
        : (
          <>
            <span
              data-cy="TodoTitle"
              className="todo__title"
              onDoubleClick={() => setIsTitleUpdating(true)}
            >
              {todo.title}
            </span>
            <button
              type="button"
              className="todo__remove"
              data-cy="TodoDeleteButton"
              onClick={() => deleteTodo(todo.id)}
            >
              ×
            </button>
          </>

        )}

      <div
        data-cy="TodoLoader"
        className={cn(
          'modal', 'overlay',
          {
            'is-active': deletingTodoIds.includes(todo.id)
              || updatingTodoIds.includes(todo.id),
          },
        )}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
});
