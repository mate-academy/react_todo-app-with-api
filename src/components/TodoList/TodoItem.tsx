import cn from 'classnames';
import React, { useEffect, useRef, useState } from 'react';
import { Todo } from '../../types/Todo';

type Props = {
  todo: Todo,
  isLoading: boolean,
  handleDeleteTodo: (value: number) => void,
  handleCompleteTodo: (
    id: number,
    completed: boolean,
  ) => void,
  handleChangeTodoTitle: (
    id: number,
    newTitle: string,
  ) => void,
};

export const TodoItem: React.FC<Props> = ({
  todo,
  isLoading,
  handleDeleteTodo,
  handleCompleteTodo,
  handleChangeTodoTitle,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(todo.title);

  const editTodo = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editTodo.current) {
      editTodo.current.focus();
    }
  }, [isEditing]);

  const handleEditedTitleSubmit = () => {
    const trimmedTitle = editedTitle.trim();

    if (trimmedTitle === todo.title) {
      setEditedTitle(trimmedTitle);
    } else if (!trimmedTitle) {
      handleDeleteTodo(todo.id);
    } else {
      handleChangeTodoTitle(todo.id, trimmedTitle);
    }

    setIsEditing(false);
  };

  // const handleChangeTodoTitle = (todoId: number, newTitle: string) => {
  //   setLoading(true);
  //   changeTodoTitle(todoId, newTitle)
  //     .then(() => {
  //       setTodos(todos.map(todo => (todo.id === todoId
  //         ? { ...todo, title: newTitle }
  //         : todo
  //       )));
  //     })
  //     .catch(() => {
  //       setErrorMessage('Unable to update a todo');
  //     })
  //     .finally(() => {
  //       setLoading(false);
  //     });
  // };

  const onSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    handleEditedTitleSubmit();
  };

  return (
    <>
      <div
        data-cy="Todo"
        className={cn('todo',
          {
            completed: todo.completed,
          })}
      >
        <label className="todo__status-label">
          <input
            data-cy="TodoStatus"
            type="checkbox"
            className="todo__status"
            defaultChecked={todo.completed}
            // checked={todo.completed}
            onClick={() => handleCompleteTodo(todo.id, !todo.completed)}
          />
        </label>

        {isEditing ? (
          <form onSubmit={onSubmit}>
            <input
              data-cy="TodoTitleField"
              type="text"
              className="todo__title-field"
              placeholder="What needs to be done? Deleted if empty"
              value={editedTitle}
              ref={editTodo}
              onChange={(event) => setEditedTitle(event.target.value)}
              onKeyUp={event => {
                if (event.key === 'Escape') {
                  setIsEditing(false);
                }
              }}
              onBlur={handleEditedTitleSubmit}
            />
          </form>
        ) : (
          <>
            <span
              onDoubleClick={() => setIsEditing(true)}
              data-cy="TodoTitle"
              className="todo__title"
            >
              {todo.title}
            </span>

            <button
              type="button"
              className="todo__remove"
              data-cy="TodoDelete"
              onClick={() => handleDeleteTodo(todo.id)}
            >
              ×
            </button>
          </>

        )}

        {/* overlay will cover the todo while it is being updated */}
        <div
          data-cy="TodoLoader"
          className={cn('modal overlay',
            {
              'is-active': isLoading,
            })}
        >
          <div className="modal-background has-background-white-ter" />
          <div className="loader" />
        </div>
      </div>
    </>
  );
};
