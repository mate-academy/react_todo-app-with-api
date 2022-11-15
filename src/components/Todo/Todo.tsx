import React, { useContext, useEffect, useState } from 'react';
import cn from 'classnames';
import { Todo } from '../../types/Todo';
import { removeTodo, editTodo } from '../../api/todos';
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
    tooggleDoubleClick,
    setToggleDoubleClick,
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

  const editTodos = async (toDo: Todo) => {
    const trimTitle = inputTitle.trim();

    if (trimTitle.length < 1) {
      setToggleDoubleClick(null);
      removeTodo(toDo);

      return;
    }

    if (trimTitle === toDo.title) {
      setToggleDoubleClick(null);

      return;
    }

    try {
      if (setEdittingTodo) {
        setEdittingTodo(toDo);
      }

      setToggleDoubleClick(null);
      await editTodo(toDo, trimTitle);
    } catch {
      setErrorMessage('Unable to update a todo');
    }

    if (user) {
      getTodo(user.id);
    }

    setToggleDoubleClick(null);
  };

  useEffect(() => {
    if (editTitle.current) {
      editTitle.current.focus();
    }

    const onClick = (event: any) => {
      if (editTitle.current?.contains(event.target)) {
        setToggleDoubleClick(null);
      }
    };

    document.addEventListener('click', onClick);

    return () => document.removeEventListener('click', onClick);
  }, [tooggleDoubleClick]);

  const onBlur = (toDo: Todo) => {
    editTodos(toDo);
  };

  const onEditting = (toDo: Todo) => {
    setToggleDoubleClick(toDo);
    setInputTitle(toDo.title);
  };

  const onKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === 'Escape') {
      setToggleDoubleClick(null);
    }
  };

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

      {(tooggleDoubleClick !== todo)
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
            onSubmit={() => editTodos(todo)}
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

      {tooggleDoubleClick !== todo && (
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
          'is-active': (removingTodo && removingTodo.id === todo.id)
          || !todo.id || (edittingTodo?.id === todo.id),
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
