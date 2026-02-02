import classNames from 'classnames';
import { Todo } from '../../types/Todo';

type Props = {
  todos: Todo[];
  visibleTodos: Todo[];
  tempTodo: Todo | null;
  deletingIds: number[];
  updatingIds: number[];
  handleChangeStatus: (todo: Todo) => void;
  editingTodoId: number | null;
  handleSubmitEdit: (event: React.FormEvent) => void;
  editingTitle: string;
  editField: React.RefObject<HTMLInputElement>;
  setEditingTodoId: (value: number | null) => void;
  setEditingTitle: (value: string) => void;
  handleFinishingEditing: () => void;
  handleDelete: (value: number) => void;
};

export const TodoList: React.FC<Props> = ({
  todos,
  visibleTodos,
  tempTodo,
  deletingIds,
  updatingIds,
  handleChangeStatus,
  editingTodoId,
  handleSubmitEdit,
  editingTitle,
  editField,
  setEditingTodoId,
  setEditingTitle,
  handleFinishingEditing,
  handleDelete,
}) => {
  return (
    <section
      className={classNames('todoapp__main', {
        hidden: todos.length === 0,
      })}
      data-cy="TodoList"
    >
      {/* This is a completed todo */}
      {visibleTodos.map(todo => {
        const isLoadingTodo =
          (tempTodo && todo === tempTodo) ||
          deletingIds.includes(todo.id) ||
          updatingIds.includes(todo.id);

        return (
          <div
            data-cy="Todo"
            key={todo.id}
            className={classNames('todo', { completed: todo.completed })}
          >
            {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
            <label className="todo__status-label">
              <input
                data-cy="TodoStatus"
                type="checkbox"
                className="todo__status"
                checked={todo.completed}
                onChange={() => handleChangeStatus(todo)}
              />
            </label>
            {editingTodoId === todo.id ? (
              <form onSubmit={handleSubmitEdit}>
                <input
                  data-cy="TodoTitleField"
                  type="text"
                  value={editingTitle}
                  ref={editField}
                  className="todo__title-field"
                  onChange={event => setEditingTitle(event.target.value)}
                  onKeyUp={event => {
                    if (event.key === 'Escape') {
                      setEditingTodoId(null);
                      setEditingTitle('');
                    }
                  }}
                  onBlur={handleFinishingEditing}
                />
              </form>
            ) : (
              <>
                <span
                  onDoubleClick={() => {
                    setEditingTodoId(todo.id);
                    setEditingTitle(todo.title);
                  }}
                  data-cy="TodoTitle"
                  className="todo__title"
                >
                  {todo.title}
                </span>

                <button
                  type="button"
                  className="todo__remove"
                  data-cy="TodoDelete"
                  onClick={() => handleDelete(todo.id)}
                >
                  ×
                </button>
              </>
            )}
            {/* overlay will cover the todo while it is being deleted or updated */}
            <div
              data-cy="TodoLoader"
              className={classNames('modal overlay', {
                'is-active': isLoadingTodo,
                hidden: !isLoadingTodo,
              })}
            >
              <div className="modal-background has-background-white-ter" />
              <div className="loader" />
            </div>
          </div>
        );
      })}
    </section>
  );
};
