import React, { useEffect, useRef, useState } from 'react';
import { Todo } from '../../types/Todo';
import classNames from 'classnames';
import { deleteTodo, renameTodo, toggleTodo } from '../../api/todos';
import { ErrorMessage } from '../../types/ErrorMesage';

type Props = {
  todo: Todo;
  handleDeleteTodoClick: (id: number) => void;
  isDeletedTodoHasLoader: boolean;
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>;
  setRenameTodoTitle: (title: string) => void;
  isTodoRenaming: boolean;
  setIsTodoRenaming: (state: boolean) => void;
  renameTodoTitle: string;
  handleError: (error: string) => void;
};

export const TodoInput: React.FC<Props> = ({
  todo,
  handleDeleteTodoClick,
  isDeletedTodoHasLoader,
  setTodos,
  setRenameTodoTitle,
  isTodoRenaming,
  setIsTodoRenaming,
  renameTodoTitle,
  handleError,
}) => {
  const [deletedTodoId, setDeletedTodoId] = useState(0);
  const [isCompleted, setIsCompleted] = useState(todo.completed);
  const [isToggledTodoHasLoader, setIsToggledTodoHasLoader] = useState(false);
  const [selectedTodoForRenamingId, setSelectedTodoForRenamingId] = useState(0);
  const [isRenamedTodoHasLoader, setIsRenamedTodoHasLoader] = useState(false);

  const inputRenameRef = useRef<HTMLInputElement | null>(null);
  const selectedTodoForRenaming = todo.id === selectedTodoForRenamingId;

  useEffect(() => {
    if (isTodoRenaming && inputRenameRef.current) {
      inputRenameRef.current?.focus();
    }
  }, [isTodoRenaming]);

  const handleToggleChange = () => {
    setIsToggledTodoHasLoader(true);
    toggleTodo({ completed: !isCompleted }, todo.id)
      .then(() => {
        setIsCompleted(prev => !prev);
        setTodos(prevTodos =>
          prevTodos.map(prevTodo =>
            prevTodo.id === todo.id
              ? { ...prevTodo, completed: !prevTodo.completed }
              : prevTodo,
          ),
        );
      })
      .catch(() => {
        handleError(ErrorMessage.UpdateTodoError);
      })
      .finally(() => {
        setIsToggledTodoHasLoader(false);
      });
  };

  const handleRenameTodo = async (event?: React.FormEvent) => {
    if (event) {
      event.preventDefault();
    }

    if (renameTodoTitle === 'empty') {
      setIsTodoRenaming(false);
      setSelectedTodoForRenamingId(0);

      return;
    }

    if (
      renameTodoTitle.trim() === todo.title.trim() ||
      renameTodoTitle.trim() === ''
    ) {
      if (renameTodoTitle.trim() === '') {
        setIsRenamedTodoHasLoader(true);
        try {
          await deleteTodo(selectedTodoForRenamingId);
          setTodos(prevTodos =>
            prevTodos.filter(
              currTodo => selectedTodoForRenamingId !== currTodo.id,
            ),
          );
          setIsTodoRenaming(false);
          setSelectedTodoForRenamingId(0);
        } catch {
          handleError(ErrorMessage.DeleteTodoError);
        } finally {
          setIsRenamedTodoHasLoader(false);
        }
      } else {
        setIsTodoRenaming(false);
        setSelectedTodoForRenamingId(0);
      }

      return;
    }

    setIsRenamedTodoHasLoader(true);

    try {
      await renameTodo({ title: renameTodoTitle.trim() }, todo.id);

      setTodos(prevTodos =>
        prevTodos.map(prevTodo =>
          prevTodo.id === selectedTodoForRenamingId
            ? { ...prevTodo, title: renameTodoTitle.trim() }
            : prevTodo,
        ),
      );

      setIsTodoRenaming(false);
      setSelectedTodoForRenamingId(0);
    } catch {
      handleError(ErrorMessage.UpdateTodoError);
    } finally {
      setIsRenamedTodoHasLoader(false);
    }
  };

  const handleBlur = () => {
    handleRenameTodo();
  };

  const handleKeyUp = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Escape') {
      setIsTodoRenaming(false);
      setSelectedTodoForRenamingId(0);
    }
  };

  return (
    <div
      data-cy="Todo"
      className={classNames('todo', { completed: todo.completed })}
    >
      <label className="todo__status-label" htmlFor={`input-${todo.id}`}>
        <input
          id={`input-${todo.id}`}
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          onChange={handleToggleChange}
          aria-label="Toggle todo status"
        />
      </label>
      {!selectedTodoForRenaming && (
        <>
          <span
            data-cy="TodoTitle"
            className="todo__title"
            onDoubleClick={() => {
              setSelectedTodoForRenamingId(todo.id);
              setIsTodoRenaming(true);
            }}
          >
            {todo.title}
          </span>
          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
            onClick={() => {
              handleDeleteTodoClick(todo.id);
              setDeletedTodoId(todo.id);
            }}
          >
            ×
          </button>
        </>
      )}

      {isTodoRenaming && selectedTodoForRenaming && (
        <form onSubmit={handleRenameTodo}>
          <input
            data-cy="TodoTitleField"
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            defaultValue={todo.title}
            onChange={event => setRenameTodoTitle(event.target.value)}
            ref={inputRenameRef}
            onBlur={handleBlur}
            onKeyUp={handleKeyUp}
          />
        </form>
      )}
      <div
        data-cy="TodoLoader"
        className={classNames('modal overlay', {
          'is-active':
            (isDeletedTodoHasLoader && todo.id === deletedTodoId) ||
            isToggledTodoHasLoader ||
            isRenamedTodoHasLoader,
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
