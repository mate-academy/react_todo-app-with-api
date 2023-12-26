import {
  memo,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import cn from 'classnames';
import { useTodoContext } from '../../../Context/Context';
import { Todo } from '../../../types/Todo';
import { TemporaryTodo } from '../TemporaryTodo/TemporaryTodo';

export const TodoItem = memo(() => {
  const [updatedTodo, setUptatedTodo] = useState<Todo | null>(null);
  const [todoTitle, setTodoTitle] = useState('');
  const {
    filteredList,
    tempTodo,
    handleDelete,
    onDelete,
    editTodo,
    toggleTodoCompleted,
    setOnDelete,
    errorMessage,
  } = useTodoContext();

  const titleInput = useRef<HTMLInputElement>(null);
  const escapeFunction = useCallback((event:KeyboardEvent) => {
    if (event.key === 'Escape') {
      setUptatedTodo(null);
    }
  }, []);

  const handleTitleForm = useCallback((event:React.FormEvent) => {
    event.preventDefault();

    if (!updatedTodo) {
      return;
    }

    if (updatedTodo.title === todoTitle.trim()) {
      setUptatedTodo(null);

      return;
    }

    if (!todoTitle) {
      handleDelete(updatedTodo.id).then(() => {
        setUptatedTodo(null);
      });

      return;
    }

    editTodo({ ...updatedTodo, title: todoTitle.trim() })
      .then(() => {
        setUptatedTodo(null);
      })
      .catch(() => {})
      .finally(() => {
        setOnDelete([]);
      });
  }, [todoTitle, editTodo, handleDelete,
    setOnDelete, updatedTodo]);

  useEffect(() => {
    if (titleInput.current) {
      titleInput.current.focus();
    }

    document.addEventListener('keyup', escapeFunction, false);

    return () => {
      document.removeEventListener('keyup', escapeFunction, false);
    };
  }, [updatedTodo, escapeFunction, errorMessage, todoTitle]);

  return (
    <section className="todoapp__main" data-cy="TodoList">
      {filteredList.map((todo) => {
        const {
          id,
          completed,
          title,
        } = todo;

        return (
          <div
            key={id}
            data-cy="Todo"
            className={cn('todo',
              { completed })}
          >
            <label className="todo__status-label">
              <input
                data-cy="TodoStatus"
                type="checkbox"
                className="todo__status"
                onChange={() => toggleTodoCompleted(todo)}
                checked={completed}
              />
            </label>
            {updatedTodo?.id !== id
              ? (
                <>
                  <span
                    onDoubleClick={() => {
                      setUptatedTodo(todo);
                      setTodoTitle(title);
                    }}
                    data-cy="TodoTitle"
                    className="todo__title"
                  >
                    { title }
                  </span>
                  <button
                    onClick={() => handleDelete(id)}
                    type="button"
                    className="todo__remove"
                    data-cy="TodoDelete"
                  >
                    ×
                  </button>
                </>
              )
              : (
                <form onSubmit={handleTitleForm}>
                  <input
                    ref={titleInput}
                    data-cy="TodoTitleField"
                    type="text"
                    className="todo__title-field"
                    placeholder="Empty todo will be deleted"
                    value={todoTitle}
                    onChange={(event) => setTodoTitle(event.target.value)}
                    onBlur={handleTitleForm}
                  />
                </form>
              )}
            <div
              data-cy="TodoLoader"
              className={cn('modal overlay',
                { 'is-active': onDelete.includes(id) })}
            >
              <div className="modal-background has-background-white-ter" />
              <div className="loader" />
            </div>
          </div>
        );
      })}
      {tempTodo && <TemporaryTodo />}
    </section>
  );
});
