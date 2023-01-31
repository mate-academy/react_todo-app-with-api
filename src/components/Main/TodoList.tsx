import React, { memo } from 'react';
import cn from 'classnames';
import { Todo } from '../../types/Todo';
// import { TodoTitleField } from './TodoTitleField';
import { TodoInfo } from './TodoInfo';

type Props = {
  todosList: Todo[],
  isAdding?: boolean,
  tempNewTask: Todo | null,
  deleteTodo: (value: number) => void,
  deletingTodoIds: number[],
  updateTodo: (
    todoId: number,
    newData: Partial<Pick<Todo, 'title' | 'completed'>>,
  ) => Promise<void>,
  updatingTodoIds: number[],
};

export const TodoList: React.FC<Props> = memo(({
  todosList,
  tempNewTask,
  deleteTodo,
  deletingTodoIds,
  updateTodo,
  updatingTodoIds,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todosList.map(todo => (
        <TodoInfo
          todo={todo}
          deleteTodo={deleteTodo}
          deletingTodoIds={deletingTodoIds}
          updateTodo={updateTodo}
          updatingTodoIds={updatingTodoIds}
        />
      ))}

      {tempNewTask && (
        <div
          data-cy="Todo"
          className={cn(
            'todo',
            { completed: tempNewTask.completed },
          )}
        >
          <label className="todo__status-label">
            <input
              data-cy="TodoStatus"
              type="checkbox"
              className="todo__status"
              defaultChecked
            />
          </label>

          <span data-cy="TodoTitle" className="todo__title">
            {tempNewTask.title}
          </span>
          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDeleteButton"
          >
            ×
          </button>

          <div
            data-cy="TodoLoader"
            className={cn(
              'modal', 'overlay', 'is-active',
            )}
          >
            <div className="modal-background has-background-white-ter" />
            <div className="loader" />
          </div>
        </div>
      )}
    </section>
  );
});
