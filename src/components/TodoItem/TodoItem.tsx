/* eslint-disable no-console */
import React, { ChangeEvent, KeyboardEvent, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import cn from 'classnames';
import { AppDispatch, RootState } from '../../redux/store';
import { Todo } from '../../types/Todo';
import {
  deleteTodo,
  setCompletion,
  renameTodo,
} from '../../redux/todoThunks';

type TodoItemProps = {
  todo: Todo;
  isTemporary: boolean;
  isDeleting: boolean;
};

export const TodoItem = React.memo<TodoItemProps>(
  ({
    todo, isTemporary, isDeleting,
  }) => {
    console.log('item is temporary now', isTemporary);
    console.log('Rendering TodoItem');
    const [isEditing, setIsEditing] = useState(false);
    const [editableTitle, setEditableTitle] = useState(todo.title);

    const dispatch = useDispatch<AppDispatch>();
    const updatingTodoIds = useSelector(
      (state: RootState) => state.todos.updatingTodoIds,
    );

    const handleDeleteTodo = () => {
      dispatch(deleteTodo(todo.id))
        .catch((err: string) => {
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
      renameTodo({
        todoId: todo.id,
        newName: editableTitle,
      });
      setIsEditing(false);
    };

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
      setEditableTitle(e.target.value);
    };

    const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter') {
        renameTodo({
          todoId: todo.id,
          newName: editableTitle,
        });
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
          // Show the input field when the todo is being edited
          <form>
            <input
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
          // Show the todo title and delete button when not editing
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

        {(isTemporary || isDeleting || updatingTodoIds.includes(todo.id)) && (
          // Show loading overlay when the todo is being processed
          <div data-cy="TodoLoader" className="modal overlay">
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
