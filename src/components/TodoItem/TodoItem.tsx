import React, { useState } from 'react';
import classNames from 'classnames';
import { Todo } from '../../types/Todo';
import { deleteTodo, patchTodo } from '../../api/todos';

type Props = {
  todo: Todo;
  deleteItem: (todoId: number) => void;
  toggleStatus: (
    todoId: number,
    todo: Todo,
    setIsToggle: React.Dispatch<React.SetStateAction<boolean>>
  ) => void;
  updateTodos: () => void;
  errorMessages: string[];
  // eslint-disable-next-line no-empty-pattern
  setErrorMessages: ([]) => void;
};

export const TodoItem: React.FC<Props> = (props) => {
  const {
    todo,
    deleteItem,
    toggleStatus,
    updateTodos,
    errorMessages,
    setErrorMessages,
  } = props;

  const [isDoubleClicked, setIsDoubleClicked] = useState(false);
  const [updatedTitle, setUpdatedTitle] = useState(todo.title);
  const [isLoading, setIsLoading] = useState(false);

  const handleRename = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setUpdatedTitle(updatedTitle.trim());
    if (updatedTitle === '') {
      deleteTodo(todo.id)
        .then(() => {
          updateTodos();
          setIsDoubleClicked(false);
        })
        .catch(() => {
          setErrorMessages([...errorMessages, 'Unable to delete a todo']);
          setIsDoubleClicked(false);
          setUpdatedTitle(todo.title);
        });

      return;
    }

    if (updatedTitle === todo.title) {
      setIsDoubleClicked(false);

      return;
    }

    setIsLoading(true);

    const updatedTodo = {
      id: todo.id,
      userId: todo.userId,
      title: updatedTitle,
      completed: todo.completed,
    };

    patchTodo(todo.id, updatedTodo).then(() => {
      updateTodos();
      setIsLoading(false);
      setIsDoubleClicked(false);
    })
      .catch(() => {
        setErrorMessages([...errorMessages, 'Unable to update a todo']);
        setIsLoading(false);
        setIsDoubleClicked(false);
      });
  };

  const handleCloseOnEsc = (key: string) => {
    if (key === 'Escape') {
      setIsDoubleClicked(false);
    }
  };

  return (
    <div
      className={classNames(
        'todo',
        {
          completed: todo.completed,
        },
      )}
      data-cy="TodoItem"
    >
      <label className="todo__status-label">
        <input
          type="checkbox"
          className="todo__status"
          data-cy="TodoStatus"
          onClick={() => {
            setIsLoading(true);
            toggleStatus(todo.id, todo, setIsLoading);
          }}
        />
      </label>

      {isDoubleClicked
        ? (
          <form onSubmit={e => handleRename(e)}>
            <input
              data-cy="TodoTitleField"
              type="text"
              className="todo__title-field"
              placeholder="Empty todo will be deleted"
              defaultValue={todo.title}
              value={updatedTitle}
              onKeyDown={e => handleCloseOnEsc(e.key)}
              onChange={e => {
                setUpdatedTitle(e.target.value);
              }}
            />
          </form>
        )
        : (
          // eslint-disable-next-line jsx-a11y/no-static-element-interactions
          <div
            className="todo__title"
            data-cy="TodoTitle"
            onClick={(event) => {
              if (event.detail === 2) {
                setIsDoubleClicked(true);
              }
            }}
            onKeyDown={() => {}}
          >
            {todo.title}
          </div>
        )}

      <button
        className="todo__remove"
        data-cy="TodoDeleteButton"
        type="button"
        onClick={() => deleteItem(todo.id)}
      >
        ×
      </button>
      <div
        data-cy="TodoLoader"
        className={classNames(
          'modal overlay',
          {
            'is-active': isLoading,
          },
        )}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
