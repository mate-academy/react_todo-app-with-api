/* eslint-disable jsx-a11y/label-has-associated-control */
import { Todo } from '../../types/Todo';
import { Filter } from '../../types/Filter';
import classNames from 'classnames';
import { useState, useRef, useEffect } from 'react';

type Props = {
  todos: Todo[];
  filter: Filter;
  tempTodo: Todo | null;
  deleteTodo: (id: number) => void;
  processingTodoIds: number[];
  updateTodoData: (todoId: number, data: Partial<Todo>) => Promise<void>;
  setIsEditingTodo: (isEditing: boolean) => void;
};

export const TodoList: React.FC<Props> = ({
  todos,
  filter,
  tempTodo,
  deleteTodo,
  processingTodoIds,
  updateTodoData,
  setIsEditingTodo,
}) => {
  const [editingTodoId, setEditingTodoId] = useState<number | null>(null);
  const [editingTitle, setEditingTitle] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const editInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editingTodoId !== null && editInputRef.current) {
      editInputRef.current.focus();
    }
  }, [editingTodoId]);

  async function handleFinishEditing(
    /* eslint-disable-next-line */
    e: React.FormEvent<HTMLFormElement> | React.FocusEvent<HTMLInputElement> | null,
    toDoID: number,
    fromBlur: boolean = false,
  ) {
    e?.preventDefault();

    if (isSubmitting) {
      return;
    }

    setIsSubmitting(true);

    const newTitle = editingTitle.trim();
    const originalTodo = todos.find(todo => todo.id === toDoID);

    if (!newTitle) {
      try {
        await deleteTodo(toDoID);
        setEditingTodoId(null);
        setIsEditingTodo(false);
      } catch {
        // Keep editing state active if delete request fails
        setEditingTodoId(toDoID);
        setIsEditingTodo(true);
        requestAnimationFrame(() => {
          editInputRef.current?.focus();
        });
      } finally {
        setIsSubmitting(false);
      }

      return;
    }

    // If title hasn't changed, just cancel editing
    if (originalTodo && newTitle === originalTodo.title) {
      setEditingTodoId(null);
      setIsEditingTodo(false);
      setIsSubmitting(false);

      return;
    }

    try {
      await updateTodoData(toDoID, { title: newTitle });
      setEditingTodoId(null);
      setIsEditingTodo(false);
    } catch {
      // Keep the editing state active on failure
      setEditingTodoId(toDoID);
      setIsEditingTodo(true);

      // If error happened during blur, need to refocus manually
      if (fromBlur) {
        requestAnimationFrame(() => {
          editInputRef.current?.focus();
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section className="todoapp__main" data-cy="TodoList">
      {[...todos, tempTodo]
        .filter((todo): todo is Todo => todo !== null)
        .filter((todo: Todo) => {
          if (filter === 'active') {
            return !todo.completed;
          }

          if (filter === 'completed') {
            return todo.completed;
          }

          return true;
        })
        .map(todo => {
          const checkboxId = `todo-status-${todo.id}`;

          return (
            <div
              data-cy="Todo"
              className={`todo${todo.completed ? ' completed' : ''}`}
              key={todo.id}
            >
              <label className="todo__status-label" htmlFor={checkboxId}>
                <input
                  id={checkboxId}
                  data-cy="TodoStatus"
                  type="checkbox"
                  className="todo__status"
                  checked={todo.completed}
                  onChange={() =>
                    updateTodoData(todo.id, { completed: !todo.completed })
                  }
                />
              </label>
              {todo.id === editingTodoId ? (
                <form onSubmit={e => handleFinishEditing(e, todo.id, false)}>
                  <input
                    ref={editInputRef}
                    data-cy="TodoTitleField"
                    type="text"
                    className="todo__title-field"
                    placeholder="Empty todo will be deleted"
                    value={editingTitle}
                    onChange={e => setEditingTitle(e.target.value)}
                    onKeyUp={e => {
                      if (e.key === 'Escape') {
                        setEditingTodoId(null);
                        setIsEditingTodo(false);
                      }
                    }}
                    onBlur={() => {
                      if (!isSubmitting) {
                        handleFinishEditing(null, todo.id, true);
                      }
                    }}
                  />
                </form>
              ) : (
                <span
                  data-cy="TodoTitle"
                  className="todo__title"
                  onDoubleClick={() => {
                    setEditingTodoId(todo.id);
                    setEditingTitle(todo.title);
                    setIsEditingTodo(true);
                  }}
                >
                  {todo.title}
                </span>
              )}
              {todo.id !== editingTodoId && (
                <button
                  type="button"
                  className="todo__remove"
                  data-cy="TodoDelete"
                  onClick={() => deleteTodo(todo.id)}
                >
                  ×
                </button>
              )}
              <div
                data-cy="TodoLoader"
                className={classNames('modal overlay', {
                  'is-active':
                    todo.id === 0 || processingTodoIds.includes(todo.id),
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
