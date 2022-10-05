import classNames from 'classnames';
import { SetStateAction, useRef, useState } from 'react';
import { Todo } from '../../types/Todo';
import { FilterBy } from '../TodoFilter/TodoFilter';

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

  const handleUpdateOnCondition = (
    title: string, newTitle: string, id: number, completed: boolean,
  ) => {
    if (title === newTitle) {
      setEditTitle(false);

      return 0;
    }

    if (newTitle.trim() === '') {
      onDelete(id);
      setDeletingId(id);
    }

    const updated = onUpdate(id, completed, newTitle);

    setUpdatingId(id);

    setTimeout(() => {
      setUpdatingId(null);
    }, 600);

    setEditTitle(false);

    return updated;
    // return handleUpdate(id, completed, editingNewName);
  };

  const handleStatusChange = (todoId: number, done: boolean, name: string) => {
    onUpdate(todoId, !done, name);
    setUpdatingId(todoId);

    setTimeout(() => {
      setUpdatingId(null);
    }, 600);
  };

  const handleInput = (event: {
    currentTarget: { value: SetStateAction<string>; };
  }) => {
    setEditingNewName(event.currentTarget.value);
  };

  const handleEditCancelation = (key: {
    key: string;
  }) => {
    if (key.key === 'Escape') {
      setEditTitle(false);
    }
  };

  const handleTodoDeletion = (todoId: number) => {
    onDelete(todoId);
    setDeletingId(todoId);
  };

  const handleEditingInit = (todoId: number, name: string) => {
    setEditTitle(true);
    setEditingId(todoId);
    setEditingNewName(name);
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
                onChange={() => handleStatusChange(id, completed, title)}
              />

            </label>
            {editingTitle && editingId === id
              ? (
                <form
                  onSubmit={(event) => {
                    event.preventDefault();

                    handleUpdateOnCondition(
                      title, editingNewName, id, completed,
                    );
                  }}
                >
                  <input
                    onBlur={() => {
                      handleUpdateOnCondition(
                        title, editingNewName, id, completed,
                      );
                    }}
                    data-cy="TodoTitleField"
                    type="text"
                    className="todo__title-field"
                    placeholder="Empty todo will be deleted"
                    defaultValue={title}
                    ref={editTodoField}
                    onChange={handleInput}
                    onKeyDown={handleEditCancelation}
                  />
                </form>
              )
              : (
                <>
                  <span
                    data-cy="TodoTitle"
                    className="todo__title"
                    onDoubleClick={() => {
                      handleEditingInit(id, title);
                      setTimeout(() => editTodoField.current?.focus(), 100);
                    }}
                  >
                    {title}
                  </span>
                  <button
                    type="button"
                    className="todo__remove"
                    data-cy="TodoDeleteButton"
                    onClick={() => handleTodoDeletion(id)}
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
