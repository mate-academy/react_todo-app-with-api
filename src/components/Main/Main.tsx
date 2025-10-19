import { useState } from 'react';
import { ErrorCode } from '../../types/ErrorCode';
import { Todo } from '../../types/Todo';

import { Loader } from '../Loader/Loader';
import cn from 'classnames';

type Props = {
  tempTodo?: Todo | null;
  todos: Todo[];
  updatingIds: number[];
  deletingIds: number[];
  onShowError: (code: Exclude<ErrorCode, null>) => void;
  onClearError: () => void;
  onStatusUpdate: (id: number, completed: boolean) => void;
  TodoDeleteButton: (id: number) => Promise<void>;
  onTitleUpdate: (id: number, title: string) => Promise<void>;
};

export const Main: React.FC<Props> = ({
  tempTodo,
  todos,
  updatingIds,
  deletingIds,
  onShowError,
  onClearError,
  TodoDeleteButton,
  onStatusUpdate = () => {},
  onTitleUpdate,
}) => {
  const [editingId, setEditingId] = useState<number | null>(null);
  const [draftTitle, setDraftTitle] = useState<string>('');

  //#region Handlers
  const handleDoubleClick = (todo: Todo) => {
    setEditingId(todo.id);
    setDraftTitle(todo.title);
  };

  const handleChangeDraft = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDraftTitle(e.target.value);
  };

  const handleCommit = (id: number) => {
    const newTitle = draftTitle.trim();
    const oldTitle = todos.find(todo => todo.id === id)?.title || '';
    // якщо нічого не змінилось — просто вийти з редагування

    if (todos.find(todo => todo.id === id)?.title === newTitle) {
      setEditingId(null);

      return;
    }

    if (newTitle === '') {
      TodoDeleteButton(id)
        .then(() => setEditingId(null))
        .catch(() => {
          setEditingId(id);
          setDraftTitle('');
          onShowError('delete_failed');

          setTimeout(() => {
            onClearError();
          }, 3000);
        });

      return;
    }

    onTitleUpdate(id, newTitle)
      .then(() => {
        setEditingId(null);
      })
      .catch(() => {
        // якщо помилка встановлюємо старий тайтл та залишаємо editingId активним
        setDraftTitle(oldTitle);
        onShowError('update_failed');

        setTimeout(() => {
          onClearError();
        }, 3000);
      });
  };

  const handleCancel = () => {
    setDraftTitle('');
    setEditingId(null);
  };
  //#endregion

  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => {
        const isLoading =
          updatingIds.includes(todo.id) || deletingIds.includes(todo.id);

        return (
          <div
            data-cy="Todo"
            className={cn('todo', {
              completed: todo.completed === true,
            })}
            key={todo.id}
          >
            <label
              className="todo__status-label"
              aria-label="Toggle todo status"
            >
              <input
                id={`todo-status-${todo.id}`}
                data-cy="TodoStatus"
                type="checkbox"
                className="todo__status"
                checked={todo.completed}
                onChange={event =>
                  onStatusUpdate(todo.id, event.target.checked)
                }
              />
            </label>

            {editingId === todo.id ? (
              <input
                className="todo__title-field"
                data-cy="TodoTitleField"
                value={draftTitle}
                autoFocus
                onFocus={e => e.currentTarget.select()}
                onChange={handleChangeDraft}
                onBlur={() => handleCommit(todo.id)} // зберегти на blur
                onKeyDown={e => {
                  if (e.key === 'Enter') {
                    handleCommit(todo.id);
                  } // зберегти на Enter

                  if (e.key === 'Escape') {
                    handleCancel();
                  } // скасувати на Esc
                }}
              />
            ) : (
              <span
                data-cy="TodoTitle"
                className="todo__title"
                onDoubleClick={() => handleDoubleClick(todo)} // увімкнути режим редагування
              >
                {todo.title}
              </span>
            )}

            {/* Remove button appears only on hover */}
            {!editingId && (
              <button
                type="button"
                className="todo__remove"
                data-cy="TodoDelete"
                onClick={() => TodoDeleteButton(todo.id)}
              >
                ×
              </button>
            )}

            {/* overlay will cover the todo while it is being deleted or updated */}
            {/* {isUpdating && <span style={{ marginLeft: 8 }}>loading…</span>} */}
            {/* {isUpdating && <Loader />} */}
            <Loader isActive={isLoading} />
          </div>
        );
      })}
      {tempTodo && (
        <div
          data-cy="Todo"
          className={cn('todo', {
            completed: tempTodo.completed === true,
          })}
          key={tempTodo.id}
        >
          <label className="todo__status-label" aria-label="Toggle todo status">
            <input
              id={`todo-status-${tempTodo.id}`}
              data-cy="TodoStatus"
              type="checkbox"
              className="todo__status"
              disabled
              checked={tempTodo.completed}
            />
          </label>

          <span data-cy="TodoTitle" className="todo__title">
            {tempTodo.title}
          </span>

          {/* Remove button appears only on hover */}
          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
            disabled
            aria-disabled
            title="Creating..."
          >
            ×
          </button>
          <Loader isActive={true} />
        </div>
      )}
    </section>
  );
};
