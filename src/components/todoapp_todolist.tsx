/* eslint-disable jsx-a11y/label-has-associated-control */
import classNames from 'classnames';
import { Todo } from '../types/Todo';

type Props = {
  filteredTodos: Todo[];
  handleCompleted: (id: number) => void;
  tempTodo: Todo | null;
  deleteTask: (id: number) => void;
  deletingIds: number[];
  onUpdate: number[];
  onEdit: (id: number | null) => void;
  editId: number | null;
  onSubmitNewTitle: (id: number, newTitl: string) => void;
  setNewTitle: (title: string) => void;
  newTitle: string;
};

export const TodoList = ({
  filteredTodos,
  handleCompleted,
  deleteTask,
  deletingIds,
  onUpdate,
  onEdit,
  editId,
  onSubmitNewTitle,
  setNewTitle,
  newTitle,
  tempTodo,
}: Props) => {
  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    id: number,
  ) => {
    if (e.key === 'Enter') {
      onSubmitNewTitle(id, newTitle);
      onEdit(null);
    }
  };

  return (
    <section className="todoapp__main" data-cy="TodoList">
      {tempTodo && (
        <>
          <div data-cy="Todo" className="todo">
            <label className="todo__status-label">
              <input
                data-cy="TodoStatus"
                type="checkbox"
                className="todo__status"
              />
            </label>

            <span data-cy="TodoTitle" className="todo__title">
              {tempTodo.title}
            </span>
            <div data-cy="TodoLoader" className="modal overlay is-active">
              <div className="modal-background has-background-white-ter" />
              <div className="loader" />
            </div>
          </div>
        </>
      )}
      {filteredTodos.map(task => {
        const { title, completed, id } = task;
        const isEditing = id === editId;

        const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
          setNewTitle(e.target.value);
        };

        const handleTitleSubmit = () => {
          onSubmitNewTitle(id, newTitle);
          onEdit(null);
        };

        return (
          <div
            key={id}
            data-cy="Todo"
            className={classNames('todo', { completed: completed })}
            onDoubleClick={() => {
              onEdit(id);
              setNewTitle(title);
            }}
            onBlur={() => onEdit(null)}
          >
            <label
              htmlFor={`Input-task-title#${id}`}
              className="todo__status-label"
            >
              <input
                id={`Input-task-title#${id}`}
                data-cy="TodoStatus"
                type="checkbox"
                className="todo__status"
                onChange={() => handleCompleted(id)}
                checked={completed}
              />
            </label>
            {isEditing ? (
              <form
                key={id}
                onSubmit={e => {
                  e.preventDefault();
                  handleTitleSubmit();
                }}
              >
                <input
                  data-cy="TodoTitleField"
                  type="text"
                  className="todo__title-field"
                  placeholder="Empty todo will be deleted"
                  value={newTitle}
                  onChange={handleTitleChange}
                  autoFocus={true}
                  onKeyDown={e => handleKeyDown(e, id)}
                  onKeyUp={e => e.keyCode == 27 && onEdit(null)}
                />
              </form>
            ) : (
              <>
                <span data-cy="TodoTitle" className="todo__title">
                  {title}
                </span>
                <button
                  type="button"
                  className="todo__remove"
                  data-cy="TodoDelete"
                  onClick={() => deleteTask(id)}
                >
                  ×
                </button>
              </>
            )}

            <div
              data-cy="TodoLoader"
              className={classNames('modal overlay ', {
                'is-active': deletingIds.includes(id) || onUpdate.includes(id),
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
