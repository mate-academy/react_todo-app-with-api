import React, {
  ChangeEvent,
  KeyboardEvent,
  useEffect,
  useRef,
  useState,
} from 'react';
import cn from 'classnames';
import { useDispatch, useSelector } from 'react-redux';
import {
  deleteTodo,
  setCompletion,
  renameTodo,
} from '../../redux/todoThunks';
import { AppDispatch, RootState } from '../../redux/store';
import { selectRenamingTodoId } from '../../redux/selectors';
import { Todo } from '../../types/Todo';

type TodoItemProps = {
  todo: Todo;
  isTemporary: boolean;
  isDeleting: boolean;
};

export const TodoItem = React.memo<TodoItemProps>(
  ({
    todo, isTemporary, isDeleting,
  }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editableTitle, setEditableTitle] = useState(todo.title);

    const dispatch = useDispatch<AppDispatch>();
    const updatingTodoIds = useSelector(
      (state: RootState) => state.todos.updatingTodoIds,
    );
    const renamingTodoId = useSelector(selectRenamingTodoId);
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
      if (isEditing && inputRef.current) {
        inputRef.current.focus();
      }
    }, [isEditing]);

    const handleDeleteTodo = () => {
      dispatch(deleteTodo(todo.id))
        .catch((err: string) => {
          // eslint-disable-next-line no-console
          console.error('Unable to delete todo:', err);
        });
    };

    const handleToggleCompletion = () => {
      dispatch(setCompletion(
        { todoId: todo.id, completed: !todo.completed },
      ));
    };

    const handleDoubleClick = () => {
      setIsEditing(true);
    };

    const handleBlur = () => {
      dispatch(renameTodo({
        todoId: todo.id,
        newName: editableTitle,
      }));
      setIsEditing(false);
    };

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
      setEditableTitle(e.target.value);
    };

    const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter') {
        dispatch(renameTodo({
          todoId: todo.id,
          newName: editableTitle,
        }));
        setIsEditing(false);
      } else if (e.key === 'Escape') {
        setEditableTitle(todo.title);
        setIsEditing(false);
      }
    };

    const itemClasses = cn({
      todo: true,
      'temp-item': isTemporary,
      completed: todo.completed,
    });

    return (
      <div data-cy="Todo" className={itemClasses}>
        <label className="todo__status-label">
          <input
            data-cy="TodoStatus"
            type="checkbox"
            className="todo__status"
            checked={todo.completed}
            onChange={handleToggleCompletion}
          />
        </label>

        {isEditing ? (
          <form>
            <input
              ref={inputRef}
              data-cy="TodoTitleField"
              type="text"
              className="todo__title-field"
              placeholder="Empty todo will be deleted"
              value={editableTitle}
              onChange={handleChange}
              onBlur={handleBlur}
              onKeyDown={handleKeyDown}
            />
          </form>
        ) : (
          <>
            <span
              className="todo__title"
              data-cy="TodoTitle"
              onDoubleClick={handleDoubleClick}
            >
              {todo.title}
            </span>

            <button
              type="button"
              className="todo__remove"
              data-cy="TodoDelete"
              onClick={handleDeleteTodo}
            >
              ×
            </button>
          </>
        )}

        {(
          isTemporary
          || isDeleting
          || updatingTodoIds.includes(todo.id)
          || renamingTodoId === todo.id
        ) && (
          <div data-cy="TodoLoader" className="overlay">
            <div className="modal-background has-background-white-ter" />
            <div className="loader" />
          </div>
        )}
      </div>
    );
  },
  (prevProps, nextProps) => {
    return (
      prevProps.todo.id === nextProps.todo.id
      && prevProps.todo.completed === nextProps.todo.completed
      && prevProps.todo.title === nextProps.todo.title
      && prevProps.isTemporary === nextProps.isTemporary
      && prevProps.isDeleting === nextProps.isDeleting
    );
  },
);
