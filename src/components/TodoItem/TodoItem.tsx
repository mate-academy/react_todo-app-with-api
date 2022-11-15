import React, { useEffect, useRef, useState } from 'react';
import cn from 'classnames';
import { Todo } from '../../types/Todo';

type Props = {
  todo: Todo;
  selectedIDs: number[];
  handleDeleteTodo: (id: number) => void;
  handleEditTodo: (id: number, data: Partial<Todo>) => void;
};

export const TodoItem: React.FC<Props> = React.memo(({
  todo,
  selectedIDs,
  handleDeleteTodo,
  handleEditTodo,
}) => {
  const newTodoField = useRef<HTMLInputElement>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [currentTitle, setCurrentTitle] = useState(todo.title);

  const toggleStatus = () => {
    const newData = {
      completed: !todo.completed,
    };

    handleEditTodo(todo.id, newData);
  };

  const editTodoTitle = (event: React.FormEvent) => {
    event.preventDefault();

    const noSpacesTitle = currentTitle.trim();

    if (noSpacesTitle === '') {
      setIsEditing(false);
      handleDeleteTodo(todo.id);

      return;
    }

    if (noSpacesTitle === todo.title) {
      setIsEditing(false);
      setCurrentTitle(todo.title);

      return;
    }

    const newData = {
      title: noSpacesTitle,
    };

    handleEditTodo(todo.id, newData);
    setIsEditing(false);
  };

  const keyPress = (event: React.KeyboardEvent) => {
    if (event.key === 'Escape') {
      setIsEditing(false);
      setCurrentTitle('');
    }
  };

  useEffect(() => {
    // focus the element with `ref={newTodoField}`
    if (newTodoField.current) {
      newTodoField.current.focus();
    }
  }, [isEditing]);

  return (
    <div
      data-cy="Todo"
      className={cn(
        'todo',
        { completed: todo.completed },
      )}
      key={todo.id}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          defaultChecked
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
              className={cn(
                'modal overlay',
                { 'is-active': selectedIDs.includes(todo.id) },
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
