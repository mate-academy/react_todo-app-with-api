import classNames from 'classnames';
import { useRef, useState } from 'react';
import { Todo } from '../types/Todo';
import { FilterBy } from './TodoFilter';

type Props = {
  todos: Todo[];
  filterType: FilterBy;
  isAdding: boolean;
  todoName: string;
  onDelete: (id: number) => void;
  onUpdate: (todoId: number, done: boolean, title: string) => void;
};

export const TodoList: React.FC<Props> = ({
  todos, filterType, isAdding, todoName, onDelete,
  onUpdate,
}) => {
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [updatingId, setUpdatingId] = useState<number | null>(null);
  const [editingTitle, setEditTitle] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingNewName, setEditingNewName] = useState('');
  const editTodoField = useRef<HTMLInputElement>(null);

  const filteredTodos = todos.filter(({ completed }) => {
    switch (filterType) {
      case FilterBy.Active:
        return completed === false;

      case FilterBy.Completed:
        return completed === true;

      case FilterBy.All:
      default:
        return true;
    }
  });

  const handleUpdate = (id: number, completed: boolean, title: string) => {
    onUpdate(id, completed, title);
    setUpdatingId(id);

    setTimeout(() => {
      setUpdatingId(null);
    }, 600);

    setEditTitle(false);
  };

  return (
    <section className="todoapp__main" data-cy="TodoList">
      {filteredTodos.map(({ id, completed, title }) => {
        return (
          <div
            key={id}
            data-cy="Todo"
            className={classNames(
              { todo: !completed },
              { 'todo completed': completed === true },
            )}
          >
            <label className="todo__status-label">
              <input
                data-cy="TodoStatus"
                type="checkbox"
                className="todo__status"
                onChange={() => {
                  onUpdate(id, !completed, title);
                  setUpdatingId(id);

                  setTimeout(() => {
                    setUpdatingId(null);
                  }, 600);
                }}
              />

            </label>
            {editingTitle && editingId === id
              ? (
                <form
                  onSubmit={(event) => {
                    event.preventDefault();

                    if (title === editingNewName) {
                      setEditTitle(false);

                      return 0;
                    }

                    if (editingNewName.trim() === '') {
                      onDelete(id);
                      setDeletingId(id);
                    }

                    return handleUpdate(id, completed, editingNewName);
                  }}
                >
                  <input
                    onBlur={() => {
                      if (title === editingNewName) {
                        setEditTitle(false);

                        return 0;
                      }

                      if (editingNewName.trim() === '') {
                        onDelete(id);
                        setDeletingId(id);
                      }

                      return handleUpdate(id, completed, editingNewName);
                    }}
                    data-cy="TodoTitleField"
                    type="text"
                    className="todo__title-field"
                    placeholder="Empty todo will be deleted"
                    defaultValue={title}
                    ref={editTodoField}
                    onChange={(event) => {
                      setEditingNewName(event.currentTarget.value);
                    }}
                    onKeyDown={(key) => {
                      if (key.key === 'Escape') {
                        setEditTitle(false);
                      }
                    }}
                  />
                </form>
              )
              : (
                <>
                  <span
                    data-cy="TodoTitle"
                    className="todo__title"
                    onDoubleClick={() => {
                      setEditTitle(true);
                      setEditingId(id);
                      setEditingNewName(title);

                      setTimeout(() => editTodoField.current?.focus(), 100);
                    }}
                  >
                    {title}
                  </span>
                  <button
                    type="button"
                    className="todo__remove"
                    data-cy="TodoDeleteButton"
                    onClick={() => {
                      onDelete(id);
                      setDeletingId(id);
                    }}
                  >
                    ×
                  </button>
                </>
              )}

            <div
              data-cy="TodoLoader"
              className={classNames(
                'modal overlay',
                { 'is-active': deletingId === id || updatingId === id },
              )}
            >
              <div className="modal-background has-background-white-ter" />
              <div className="loader" />
            </div>
          </div>
        );
      })}

      {
        isAdding && (
          <div
            key={0}
            data-cy="Todo"
            className="todo"
          >
            <label className="todo__status-label">
              <input
                data-cy="TodoStatus"
                type="checkbox"
                className="todo__status"
              />
            </label>

            <span data-cy="TodoTitle" className="todo__title">
              {todoName}
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
        )
      }
    </section>
  );
};
