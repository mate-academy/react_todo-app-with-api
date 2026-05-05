import React, { useEffect, useRef, useState } from 'react';
import cn from 'classnames';

import { Todo as TodoType } from '../../types/Todo';

type Props = {
  todo: TodoType;
  isUpdating?: boolean;
  deleteTodo?: (todoId: number) => Promise<unknown>;
  clearErrorMessage?: () => void;
  onChangeTodoCompleteness?: (
    todoId: number,
    isCompleted: boolean,
  ) => Promise<TodoType | void>;
  onRenamingTodo?: (todoId: number, title: string) => Promise<TodoType | void>;
};

const TodoBase: React.FC<Props> = ({
  todo,
  isUpdating = false,
  deleteTodo,
  clearErrorMessage = () => {},
  onChangeTodoCompleteness,
  onRenamingTodo,
}) => {
  const [isTodoUpdating, setIsTodoUpdating] = useState(isUpdating);
  const [isRenaming, setIsRenaming] = useState(false);
  const [newTitle, setNewTitle] = useState(todo.title);

  const newTitleInput = useRef<HTMLInputElement | null>(null);

  const handleChangeCompleteness = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (onChangeTodoCompleteness) {
      setIsTodoUpdating(true);
      clearErrorMessage();

      onChangeTodoCompleteness(todo.id, e.target.checked).finally(() => {
        setIsTodoUpdating(false);
      });
    }
  };

  const handleDeleteTodo = () => {
    if (deleteTodo) {
      setIsTodoUpdating(true);

      deleteTodo(todo.id).finally(() => {
        setIsTodoUpdating(false);
      });
    }
  };

  const keyupEventListener = (e: KeyboardEvent) => {
    const key = e.key;

    if (key === 'Escape') {
      setIsRenaming(false);
      setNewTitle(todo.title);

      document.removeEventListener('keyup', keyupEventListener);
    }
  };

  const handleStartRenaming = () => {
    setIsRenaming(true);

    document.addEventListener('keyup', keyupEventListener);
  };

  const handleStopRenaming = () => {
    setIsRenaming(false);
    setNewTitle(todo.title);

    document.removeEventListener('keyup', keyupEventListener);
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewTitle(e.target.value);
  };

  const handleRenamingTodo = (
    e: React.FormEvent<HTMLFormElement> | React.FocusEvent<HTMLInputElement>,
  ) => {
    e.preventDefault();

    const title = newTitle.trim();

    if (todo.title === title) {
      handleStopRenaming();

      return;
    }

    setIsTodoUpdating(true);

    if (title !== '' && onRenamingTodo) {
      onRenamingTodo(todo.id, title)
        .then(() => {
          handleStopRenaming();
        })
        .finally(() => {
          setIsTodoUpdating(false);
        });
    }

    if (title === '' && deleteTodo) {
      deleteTodo(todo.id)
        .then(() => {
          handleStopRenaming();
        })
        .finally(() => {
          setIsTodoUpdating(false);
        });
    }
  };

  useEffect(() => {
    setIsTodoUpdating(isUpdating);
  }, [isUpdating]);

  useEffect(() => {
    if (newTitleInput.current && isRenaming) {
      newTitleInput.current.focus();
    }
  }, [isRenaming]);

  return (
    <div
      data-cy="Todo"
      className={cn('todo', {
        completed: todo.completed,
      })}
    >
      <label className="todo__status-label">
        <input
          onChange={handleChangeCompleteness}
          id={`${todo.id}`}
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          aria-label="Toggle todo status"
        />
      </label>

      {isRenaming ? (
        <form onSubmit={handleRenamingTodo}>
          <input
            data-cy="TodoTitleField"
            ref={newTitleInput}
            placeholder="Empty todo will be deleted"
            className="todo__title-field"
            value={newTitle}
            onChange={handleTitleChange}
            onBlur={handleRenamingTodo}
          />
        </form>
      ) : (
        <>
          <span
            data-cy="TodoTitle"
            className="todo__title"
            onDoubleClick={handleStartRenaming}
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

      <div
        data-cy="TodoLoader"
        className={cn('modal', 'overlay', {
          'is-active': isTodoUpdating,
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};

export const Todo = React.memo(TodoBase);
