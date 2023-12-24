import {
  memo,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import cn from 'classnames';
import { useTodoContext } from '../../../Context/Context';
import { TodoItem } from '../TodoItem/TodoItem';
import { Todo } from '../../../types/Todo';

export const TodoForRender = memo(() => {
  const [todoForEdit, setTodoForEdit] = useState<Todo | null>(null);
  const [editTitle, setEditTitle] = useState('');
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
      setTodoForEdit(null);
    }
  }, []);

  const handleTitleForm = useCallback((event:React.FormEvent) => {
    event.preventDefault();

    if (!todoForEdit) {
      return;
    }

    if (todoForEdit.title === editTitle.trim()) {
      setTodoForEdit(null);

      return;
    }

    if (editTitle === '') {
      handleDelete(todoForEdit.id).then(() => {
        setTodoForEdit(null);
      });

      return;
    }

    editTodo({ ...todoForEdit, title: editTitle.trim() })
      .then(() => {
        setTodoForEdit(null);
      })
      .catch(() => {})
      .finally(() => {
        setOnDelete([]);
      });
  }, [editTitle, editTodo, handleDelete,
    setOnDelete, todoForEdit]);

  useEffect(() => {
    if (titleInput.current) {
      titleInput.current.focus();
    }

    document.addEventListener('keyup', escapeFunction, false);

    return () => {
      document.removeEventListener('keyup', escapeFunction, false);
    };
  }, [todoForEdit, escapeFunction, errorMessage, editTitle]);

  return (
    <section className="todoapp__main" data-cy="TodoList">
      {filteredList.map(({
        title,
        completed,
        id,
        userId,
      }) => (
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
              onChange={() => toggleTodoCompleted({
                title,
                completed,
                id,
                userId,
              })}
              checked={completed}
            />
          </label>
          {todoForEdit?.id !== id
            ? (
              <>
                <span
                  onDoubleClick={() => {
                    setTodoForEdit({
                      id,
                      title,
                      completed,
                      userId,
                    });
                    setEditTitle(title);
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
                  value={editTitle}
                  onChange={(event) => setEditTitle(event.target.value)}
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
      ))}
      {tempTodo && <TodoItem />}
    </section>
  );
});
