import React, { useEffect, useRef, useState } from 'react';
import cn from 'classnames';
import { Todo } from '../../types/Todo';

interface Props {
  todo: Todo;
  isUpdating: number[];
  updateTodo: (todo: Todo, editStatus: boolean) => void;
  removeTodo: (todoId: number) => void;
}

export const TodoItem: React.FC<Props> = ({
  todo,
  isUpdating,
  updateTodo = () => {},
  removeTodo = () => {},
}) => {
  const [todoTitle, setTodoTitle] = useState(todo.title);
  const [isTodoEdit, setIsTodoEdit] = useState(false);
  const todoInput = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isTodoEdit && todoInput.current) {
      todoInput.current.focus();
    }
  }, [isTodoEdit]);

  const editTodoOnSubmit = (event: React.ChangeEvent<HTMLFormElement>) => {
    event.preventDefault();
  };

  const showEditTodoForm = () => {
    setTodoTitle(todo.title);
    setIsTodoEdit(true);
  };

  const onTodoBlur = () => {
    if (isTodoEdit) {
      if (todoTitle.trim() !== '') {
        if (todoTitle.trim() !== todo.title.trim()) {
          updateTodo({ ...todo, title: todoTitle }, isTodoEdit);
        } else {
          setIsTodoEdit(false);
        }
      } else {
        removeTodo(todo.id);
      }
    }
  };

  const onTodoKeyUp = (key: string) => {
    if (key === 'Escape') {
      setTodoTitle('');
      setIsTodoEdit(false);
    }

    if (key === 'Enter') {
      onTodoBlur();
    }
  };

  return (
    <div
      data-cy="Todo"
      className={cn('todo', { completed: todo.completed })}
      onDoubleClick={showEditTodoForm}
      key={todo.id}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          onChange={() => updateTodo(todo, isTodoEdit)}
        />
      </label>

      {isTodoEdit ? (
        <form onSubmit={editTodoOnSubmit}>
          <input
            type="text"
            className="todo__title-field"
            value={todoTitle}
            onBlur={onTodoBlur}
            onKeyUp={({ key }) => onTodoKeyUp(key)}
            onChange={({ target }) => setTodoTitle(target.value)}
            ref={todoInput}
          />
        </form>
      ) : (
        <>
          <span data-cy="TodoTitle" className="todo__title">
            {todo.title}
          </span>
          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
            onClick={() => removeTodo(todo.id)}
          >
            ×
          </button>
        </>
      )}

      <div
        data-cy="TodoLoader"
        className={cn('modal overlay', {
          'is-active': todo.id === 0 || isUpdating.includes(todo.id),
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
