import React, { useRef, useState, useEffect } from 'react';
import classNames from 'classnames';
import { Todo } from '../../types/Todo';

type Props = {
  todo: Todo,
  handleDeleteTodo: (id: number) => void;
  selectedId: number[];
  editTodo: (id: number, data: Partial<Todo>) => void;
};

export const TodoItem: React.FC<Props> = React.memo(({
  todo,
  handleDeleteTodo,
  selectedId,
  editTodo,
}) => {
  const newTodoField = useRef<HTMLInputElement>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [currentTitle, setCurrentTitle] = useState(todo.title);

  const toggleStatus = () => {
    const newData = {
      completed: !todo.completed,
    };

    editTodo(todo.id, newData);
  };

  const editTodoTitle = (event: React.FormEvent) => {
    event.preventDefault();

    if (currentTitle.trim() === '') {
      setIsEditing(false);
      handleDeleteTodo(todo.id);

      return;
    }

    if (currentTitle === todo.title) {
      setIsEditing(false);
      setCurrentTitle(todo.title);

      return;
    }

    const newData = {
      title: currentTitle,
    };

    editTodo(todo.id, newData);
    setIsEditing(false);
  };

  const keyPress = (event: React.KeyboardEvent) => {
    if (event.key === 'Escape') {
      setIsEditing(false);
      setCurrentTitle('');
    }
  };

  useEffect(() => {
    if (newTodoField.current) {
      newTodoField.current.focus();
    }
  }, [isEditing]);

  return (
    <div
      key={todo.id}
      data-cy="Todo"
      className={classNames('todo', { completed: todo.completed })}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          onClick={toggleStatus}
        />
      </label>

      {isEditing ? (
        <form onSubmit={editTodoTitle} onBlur={editTodoTitle}>
          <input
            data-cy="NewTodoField"
            type="text"
            ref={newTodoField}
            className="todoapp__new-todo pl-4"
            value={currentTitle}
            onChange={(event => setCurrentTitle(event.target.value))}
            onKeyDown={keyPress}
          />
        </form>
      )
        : (
          <>
            <span
              data-cy="TodoTitle"
              className="todo__title"
              onDoubleClick={() => setIsEditing(true)}
            >
              {todo.title}
            </span>
            <button
              type="button"
              className="todo__remove"
              data-cy="TodoDeleteButton"
              onClick={() => handleDeleteTodo(todo.id)}
            >
              ×
            </button>

            <div
              data-cy="TodoLoader"
              className={classNames(
                'modal overlay',
                { 'is-active': selectedId.includes(todo.id) },
              )}
            >
              <div className="modal-background has-background-white-ter" />
              <div className="loader" />
            </div>
          </>
        )}
    </div>
  );
});
