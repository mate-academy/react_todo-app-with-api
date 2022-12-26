import { memo } from 'react';
import { Todo } from '../../types/Todo';
import { TodoInfo } from '../TodoInfo';

type Props = {
  todos: Todo[],
  isAdding: boolean,
  isUpdating: boolean,
  title: string,
  onDelete: (todoId: number) => void,
  onChangeStatus: (changeTodo: Todo) => void,
  deletingTodoId: number,
  updatingTodoId: number,
  completedTodosId: number[],
  onEditTitle: (id: number, newTitle: string) => void,
};

export const TodoList: React.FC<Props> = memo(({
  todos,
  isAdding,
  isUpdating,
  title,
  onDelete,
  deletingTodoId,
  updatingTodoId,
  completedTodosId,
  onChangeStatus,
  onEditTitle,
}) => {
  const isLoading = (todoId: number) => {
    switch (true) {
      case (completedTodosId.includes(todoId)):
      case (todoId === deletingTodoId):
      case (todoId === updatingTodoId):
      case (isUpdating):
      default:
        return true;
    }
  };

  return (
    <>
      {todos.map((todo) => (
        <TodoInfo
          key={todo.id}
          todo={todo}
          onDelete={onDelete}
          onChangeStatus={onChangeStatus}
          onEditTitle={onEditTitle}
          isLoading={isLoading(todo.id)}
        />
      ))}

      {isAdding && (
        <div
          data-cy="Todo"
          className="todo"
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
            {title}
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
    </>
  );
});
