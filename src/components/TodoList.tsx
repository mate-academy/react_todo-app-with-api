/* eslint-disable jsx-a11y/label-has-associated-control */
import React from 'react';
import { Todo } from '../types/Todo';

type Props = {
  visibleTodos: Todo[];
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>;
  tempTodo: Todo | null;
  onDelete: (todoId: number) => void;
  onToggle: (todo: Todo) => void;
  loadingTodoId: number[] | null;
  editedTitle: string;
  setEditedTitle: React.Dispatch<React.SetStateAction<string>>;
  setIsEditing: React.Dispatch<React.SetStateAction<number | null>>;
  isEditing: number | null;
  updateTodos: (todoId: number, updates: Partial<Todo>) => Promise<any>;
  setLoadingTodoId: React.Dispatch<React.SetStateAction<number[] | null>>;
  setNotificationError: React.Dispatch<React.SetStateAction<string | null>>;
};

export const TodoList: React.FC<Props> = ({
  visibleTodos,
  setTodos,
  onDelete,
  onToggle,
  loadingTodoId,
  editedTitle,
  setEditedTitle,
  setIsEditing,
  isEditing,
  updateTodos,
  setLoadingTodoId,
  setNotificationError,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {visibleTodos.map(todo => {
        const checkboxId = `todo-${todo.id}`;
        const isTemp = todo.id === 0;

        return (
          <div
            data-cy="Todo"
            className={todo.completed ? 'todo completed' : 'todo'}
            key={todo.id}
          >
            <label className="todo__status-label" htmlFor={checkboxId}>
              <input
                id={checkboxId}
                data-cy="TodoStatus"
                type="checkbox"
                className="todo__status"
                checked={todo.completed}
                onChange={() => onToggle(todo)}
                disabled={isTemp}
              />
            </label>

            {isEditing === todo.id ? (
              <input
                data-cy="TodoTitleField"
                type="text"
                value={editedTitle}
                onChange={e => setEditedTitle(e.target.value)}
                autoFocus
                  onKeyDown={async e => {
                    if (e.key === 'Enter') {
                      if (editedTitle.trim() === '') {
                        onDelete(todo.id);
                      } else if (editedTitle.trim() === todo.title) {
                        setIsEditing(null);
                        setEditedTitle('');
                      } else {
                        setLoadingTodoId(prev => (prev ? [...prev, todo.id] : [todo.id]));
                        try {
                          const updatedTodo = await updateTodos(todo.id, {
                            title: editedTitle.trim(),
                          });

                          setTodos(prev =>
                            prev.map(t => (t.id === todo.id ? updatedTodo : t))
                          );

                          setIsEditing(null);
                          setEditedTitle('');
                        } catch {
                          setNotificationError('Unable to update a todo');
                          setTimeout(() => setNotificationError(null), 3000);

                          setLoadingTodoId(prev =>
                            prev ? prev.filter(id => id !== todo.id) : null
                          );
                        } finally {
                          setLoadingTodoId(prev =>
                            prev ? prev.filter(id => id !== todo.id) : null
                          );
                        }
                      }
                    }
                    if (e.key === 'Escape') {
                      setIsEditing(null);
                      setEditedTitle('');
                    }
                  }}

                onBlur={async () => {
                  if (editedTitle.trim() === '') {
                    onDelete(todo.id);
                  } else if (editedTitle.trim() === todo.title) {
                    setIsEditing(null);
                    setEditedTitle('');
                  } else {
                    setLoadingTodoId(prev => (prev ? [...prev, todo.id] : [todo.id]));

                    try {
                      const updatedTodo = await updateTodos(todo.id, {
                        title: editedTitle.trim(),
                      });

                      setTodos(prev =>
                        prev.map(t => (t.id === todo.id ? updatedTodo : t))
                      );

                      setLoadingTodoId(prev =>
                        prev ? prev.filter(id => id !== todo.id) : null
                      );
                    } catch {
                      setNotificationError('Unable to update a todo');
                      setTimeout(() => setNotificationError(null), 3000);

                      setLoadingTodoId(prev =>
                        prev ? prev.filter(id => id !== todo.id) : null
                      );
                    } finally {
                      setIsEditing(null);
                      setEditedTitle('');
                    }
                  }
                }}

              />
            ) : (
              <>
                <span
                  data-cy="TodoTitle"
                  className="todo__title"
                  onDoubleClick={() => {
                    if (!isTemp) {
                      setIsEditing(todo.id);
                      setEditedTitle(todo.title);
                    }
                  }}
                >
                  {todo.title}
                </span>

                {!isTemp && (
                  <button
                    type="button"
                    className="todo__remove"
                    data-cy="TodoDelete"
                    onClick={() => onDelete(todo.id)}
                  >
                    x
                  </button>
                )}
              </>
            )}

            <div
              data-cy="TodoLoader"
              className={`modal overlay ${
                isTemp ||
                todo.isDeleting ||
                (loadingTodoId?.includes(todo.id) ?? false)
                  ? 'is-active'
                  : ''
              }`}
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
