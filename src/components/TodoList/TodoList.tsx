import React, { memo } from 'react';
import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem/TodoItem';

type Props = {
  todos: Todo[],
  tempTodo: Todo | null,
  handleDeleteClick: (todoId: number) => void,
  processingTodoIds: number[],
  updateTodo: (todoToUpdate: Todo) => void,
  toggleTodoStatus: (id: number, status: boolean) => void,
};

export const TodoList: React.FC<Props> = memo((props) => {
  const {
    todos,
    tempTodo,
    handleDeleteClick,
    processingTodoIds,
    updateTodo,
    toggleTodoStatus,
  } = props;

  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => (
        <TodoItem
          key={todo.id}
          todo={todo}
          handleDeleteClick={handleDeleteClick}
          processingTodoIds={processingTodoIds}
          updateTodo={updateTodo}
          toggleTodoStatus={toggleTodoStatus}
        />
      ))}

      {tempTodo && (
        <div data-cy="Todo" className="todo">
          <label className="todo__status-label">
            <input
              data-cy="TodoStatus"
              type="checkbox"
              className="todo__status"
            />
          </label>

          <span
            data-cy="TodoTitle"
            className="todo__title"
          >
            {tempTodo.title}
          </span>
          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDeleteButton"
          >
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
});
