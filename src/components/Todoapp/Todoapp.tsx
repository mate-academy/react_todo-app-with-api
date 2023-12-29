import React, { useState, useRef, useEffect } from 'react';
import cn from 'classnames';
import { Todo } from '../../types/Todo';

interface Props {
  todos: Todo[],
  deleteTodoAction: (todoId: number) => void,
  unActive: number[],
  setUnActive: (id: number[]) => void,
  changeCheckbox: (id: number) => void,
  onUpdate: (id: number, newTitle: string) => void,
}

interface EditedTitleState {
  [key: string]: string;
}

export const Todoapp: React.FC<Props> = ({
  todos,
  deleteTodoAction,
  unActive,
  setUnActive,
  changeCheckbox,
  onUpdate,
}) => {
  const [isEditing, setIsEditing] = useState<number | null>(null);
  const [editedTitle, setEditedTitle] = useState<EditedTitleState>({});

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditing]);

  const handleKeyAction = (
    event: React.KeyboardEvent<HTMLInputElement>,
    todoId: number,
    todoTitle: string,
  ) => {
    if (event.key === 'Enter') {
      if (editedTitle[todoId] !== todoTitle) {
        onUpdate(todoId, editedTitle[todoId]);

        const foundedTodo = todos.find(todo => todo.id === todoId);

        if (foundedTodo) {
          setUnActive([foundedTodo.id]);
        }
      }

      if (editedTitle[todoId] === todoTitle) {
        setUnActive([]);
      }

      if (event.target.value.trim() === '') {
        deleteTodoAction(todoId);
      }

      setIsEditing(null);
    }

    if (event.key === 'Escape') {
      setIsEditing(null);
    }
  };

  const handleBlur = (currTitle: string, currId: number) => {
    setIsEditing(null);

    if (editedTitle[currId] !== currTitle) {
      const foundedTodo = todos.find(todo => todo.id === currId);

      if (foundedTodo) {
        setUnActive([foundedTodo.id]);
      }

      onUpdate(currId, editedTitle[currId]);
    }
  };

  const doubleClickAction = (currId: number, currTitle: string) => {
    setEditedTitle(prev => ({ ...prev, [currId]: currTitle }));
    setIsEditing(currId);
  };

  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(({ id, title, completed }) => (
        <div
          data-cy="Todo"
          className={cn('todo', { completed })}
          key={id}
        >
          <label className="todo__status-label">
            <input
              data-cy="TodoStatus"
              type="checkbox"
              className="todo__status"
              checked={completed}
              onChange={() => changeCheckbox(id)}
            />
          </label>

          {isEditing === id
            ? (
              <input
                type="text"
                ref={inputRef}
                className="todo__title-field"
                value={editedTitle[id]}
                onChange={event => {
                  setEditedTitle(prev => ({
                    ...prev,
                    [id]: event.target.value,
                  }));
                }}
                onBlur={() => handleBlur(title, id)}
                onKeyUp={event => handleKeyAction(event, id, title)}
              />
            )
            : (
              <span
                data-cy="TodoTitle"
                className={cn('todo__title')}
                onDoubleClick={() => doubleClickAction(id, title)}
              >
                {editedTitle[id] || title}
              </span>
            )}

          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
            onClick={() => deleteTodoAction(id)}
          >
            ×
          </button>

          <div
            data-cy="TodoLoader"
            className={cn(
              'modal',
              'overlay',
              { 'is-active': unActive.includes(id) },
            )}
          >
            <div className="modal-background has-background-white-ter" />
            <div className="loader" />
          </div>
        </div>
      ))}
    </section>
  );
};
