/* eslint-disable jsx-a11y/control-has-associated-label */
import React, {
  useContext, useEffect, useRef,
} from 'react';
import cn from 'classnames';
import { TodoContext } from '../../TodoContext';
import { Todo } from '../../types/Todo';

export const TodoRenameForm: React.FC<{ todo: Todo }>
= React.memo(({ todo }) => {
  const {
    isChosenToRename,
    editingTodo,
    loadingTodos,
    setHandleEditing,
    setIsChosenToRename,
    setEditingTodo,
    handleDelete,
    makeTodoChange,
  } = useContext(TodoContext);

  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const todoField = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isChosenToRename && todoField.current) {
      todoField.current.focus();
    }
  }, [isChosenToRename]);

  const onSubmitRenameField = (
    event: React.FormEvent<HTMLFormElement>,
    value: Todo,
  ) => {
    event.preventDefault();
    if (!editingTodo.trim()) {
      handleDelete(value.id);
    } else if (value.title === editingTodo.trim()) {
      setIsChosenToRename(0);
      setHandleEditing(0);
    } else {
      makeTodoChange(value.id, editingTodo.trim());
    }
  };

  const onCancelEditing = () => {
    setIsChosenToRename(0);
    setEditingTodo('');
  };

  return (
    <div
      data-cy="Todo"
      className={cn('todo', {
        completed: todo.completed,
      })}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
        />
      </label>
      <form
        onSubmit={event => {
          onSubmitRenameField(event, todo);
        }}
        onBlur={(event) => {
          onSubmitRenameField(event, todo);
        }}
      >
        <input
          data-cy="TodoTitleField"
          type="text"
          className="todo__title-field"
          placeholder="Empty todo will be deleted"
          value={editingTodo}
          ref={todoField as React.RefObject<HTMLInputElement>}
          onChange={(event) => {
            setEditingTodo(event.target.value);
          }}
          onKeyUp={(event) => {
            if (event.key === 'Escape') {
              onCancelEditing();
            }
          }}
        />
      </form>

      <div
        data-cy="TodoLoader"
        className={cn('modal overlay', {
          'is-active': loadingTodos.includes(todo.id),
        })}
      >
        <div
          className="modal-background has-background-white-ter"
        />
        <div className="loader" />
      </div>
    </div>
  );
});
