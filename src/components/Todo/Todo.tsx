import React, { useContext, useEffect, useState } from 'react';
import cn from 'classnames';
import { Todo } from '../../types/Todo';
import { removeTodo, editTodos } from '../../api/todos';
import { AuthContext } from '../Auth/AuthContext';

type Props = {
  todo: Todo;
  getTodo: (userId: number) => void;
  editTitle: React.RefObject<HTMLInputElement>;
  edittingTodo?: Todo | null;
  setEdittingTodo?: React.Dispatch<React.SetStateAction<Todo | null>>;
  setTodoSelected: (todo: Todo) => void;
  setErrorMessage: React.Dispatch<React.SetStateAction<string>>;
};

export const TodoComponent: React.FC<Props> = ({
  todo,
  getTodo,
  editTitle,
  edittingTodo,
  setEdittingTodo,
  setTodoSelected,
  setErrorMessage,
}) => {
  const user = useContext(AuthContext);
  const [inputTitle, setInputTitle] = useState('');
  const [removingTodo, setRemovingTodo] = useState<Todo | null>(null);
  const [
    clickedTodo,
    setClickedTodo,
  ] = useState<Todo | null>(null);

  const removeTodos = async (toDo: Todo) => {
    if (!user) {
      return;
    }

    try {
      setRemovingTodo(toDo);
      await removeTodo(toDo);
      getTodo(user.id);
    } catch {
      setErrorMessage('Unable to delete a todo');
      setRemovingTodo(null);
    }
  };

  const editTodo = async (toDo: Todo) => {
    const trimTitle = inputTitle.trim();

    if (trimTitle.length < 1) {
      setClickedTodo(null);
      removeTodo(toDo);

      return;
    }

    if (trimTitle === toDo.title) {
      setClickedTodo(null);

      return;
    }

    try {
      if (setEdittingTodo) {
        setEdittingTodo(toDo);
      }

      setClickedTodo(null);
      await editTodos(toDo, trimTitle);
    } catch {
      setErrorMessage('Unable to update a todo');
    }

    if (user) {
      getTodo(user.id);
    }

    setClickedTodo(null);
  };

  useEffect(() => {
    if (editTitle.current) {
      editTitle.current.focus();
    }

    const onClick = (event: any) => {
      if (editTitle.current?.contains(event.target)) {
        setClickedTodo(null);
      }
    };

    document.addEventListener('click', onClick);

    return () => document.removeEventListener('click', onClick);
  }, [clickedTodo]);

  const onBlur = (toDo: Todo) => {
    editTodo(toDo);
  };

  const onEditting = (toDo: Todo) => {
    setClickedTodo(toDo);
    setInputTitle(toDo.title);
  };

  const onKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === 'Escape') {
      setClickedTodo(null);
    }
  };

  const isLoading = (removingTodo && removingTodo.id === todo.id)
  || !todo.id || (edittingTodo?.id === todo.id);

  return (
    <div
      data-cy="Todo"
      className={cn('todo', { completed: todo.completed })}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          onChange={() => setTodoSelected(todo)}
        />
      </label>

      {(clickedTodo !== todo)
        ? (
          <span
            data-cy="TodoTitle"
            className="todo__title"
            onDoubleClick={() => onEditting(todo)}
          >
            {todo.title}
          </span>
        )
        : (
          <form
            onSubmit={() => editTodo(todo)}
          >
            <input
              data-cy="TodoTitle"
              type="text"
              className="todo__title-field"
              placeholder="Empty todo will be deleted"
              ref={editTitle}
              value={inputTitle}
              onBlur={() => onBlur(todo)}
              onChange={event => setInputTitle(event.target.value)}
              onKeyDown={onKeyPress}
            />
          </form>
        )}

      {clickedTodo !== todo && (
        <button
          type="button"
          className="todo__remove"
          data-cy="TodoDeleteButton"
          onClick={() => removeTodos(todo)}
        >
          ×
        </button>
      )}

      <div
        data-cy="TodoLoader"
        className={cn('modal', 'overlay', {
          'is-active': isLoading,
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
