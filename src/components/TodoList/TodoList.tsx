import classNames from 'classnames';
import { Todo } from '../../types/Todo';
import { useEffect } from 'react';

type Props = {
  todos: Todo[];
  visibleTodos: Todo[];
  tempTodo: Todo | null;
  processingIds: number[];
  handleChangeStatus: (todo: Todo) => void;
  editingTodo: Todo | null;
  handleSubmitEdit: (event: React.FormEvent) => void;
  editField: React.RefObject<HTMLInputElement>;
  setEditingTodo: React.Dispatch<React.SetStateAction<Todo | null>>;
  handleFinishingEditing: () => void;
  handleDelete: (value: number) => void;
};

export const TodoList: React.FC<Props> = ({
  todos,
  visibleTodos,
  tempTodo,
  processingIds,
  handleChangeStatus,
  editingTodo,
  handleSubmitEdit,
  editField,
  setEditingTodo,
  handleFinishingEditing,
  handleDelete,
}) => {
  useEffect(() => {
    if (editingTodo !== null) {
      editField.current?.focus();
    }
  }, [editingTodo, editField]);

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
          (tempTodo && todo === tempTodo) || processingIds.includes(todo.id);

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
            {editingTodo?.id === todo.id ? (
              <form onSubmit={handleSubmitEdit}>
                <input
                  data-cy="TodoTitleField"
                  type="text"
                  value={editingTodo?.title ?? ''}
                  ref={editField}
                  className="todo__title-field"
                  onChange={event =>
                    setEditingTodo((prev: Todo | null) => {
                      if (!prev) {
                        return null;
                      }

                      return { ...prev, title: event.target.value };
                    })
                  }
                  onKeyUp={event => {
                    if (event.key === 'Escape') {
                      setEditingTodo(null);
                    }
                  }}
                  onBlur={handleFinishingEditing}
                />
              </form>
            ) : (
              <>
                <span
                  onDoubleClick={() => {
                    setEditingTodo(todo);
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
