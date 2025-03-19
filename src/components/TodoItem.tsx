import classNames from 'classnames';
import React, { useEffect, useRef, useState } from 'react';
import { Todo } from '../types/Todo';
import { KeyValue, OptionUpdate } from '../types/OptionsType';

type Props = {
  todoItem: Todo;
  updateChecked: (updatedTodo: Todo, option: OptionUpdate) => void;
  removeTodo: (id: number) => Promise<string>;
  waiterLoading: number | null;
  updateTitle: (todo: Todo) => Promise<string>;
};

export const TodoItem: React.FC<Props> = ({
  todoItem,
  waiterLoading,
  updateChecked = () => {},
  removeTodo,
  updateTitle,
}) => {
  const [editedTodo, setEditedTodo] = useState<Todo | null>(null);
  const editTodoRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    editTodoRef.current?.focus();
  }, [editedTodo]);

  const editOndDoubleClick = (event: React.ChangeEvent<HTMLInputElement>) => {
    editTodoRef.current?.focus();
    setEditedTodo(prev =>
      prev ? { ...prev, title: event.target.value } : null,
    );
  };

  const onUpdateTitle = (editTodo: Todo) => {
    const isEdit =
      editTodo.id === todoItem.id && todoItem.title === editTodo.title;

    if (isEdit) {
      setEditedTodo(null);

      return;
    }

    updateTitle(editTodo)
      .then(todoEdited => {
        if (todoEdited === 'error') {
          editTodoRef.current?.focus();
        } else {
          setEditedTodo(null);
        }
      })
      .finally(() => {});
  };

  const onKeyClick = async (
    event: React.KeyboardEvent<HTMLInputElement>,
    editedTodoValue?: Todo,
  ) => {
    if (event.key === KeyValue.Enter && editedTodoValue) {
      event.preventDefault();
      if (!editedTodoValue.title.trim()) {
        removeTodo(editedTodoValue.id).then(text => {
          if (text === 'error') {
            editTodoRef.current?.focus();
          }
        });
      } else {
        onUpdateTitle(editedTodoValue);
      }

      return;
    }

    if (event.key === KeyValue.Esc) {
      setEditedTodo(null);
    }
  };

  return (
    <div
      data-cy="Todo"
      className={classNames('todo', {
        completed: todoItem.completed,
      })}
      key={todoItem.id}
    >
      {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          onChange={() => {
            updateChecked(todoItem, 'once');
          }}
          checked={todoItem.completed}
        />
      </label>

      {editedTodo?.id !== todoItem.id ? (
        <>
          <span
            data-cy="TodoTitle"
            className="todo__title"
            onDoubleClick={() => {
              setEditedTodo(todoItem);
            }}
          >
            {todoItem.title}
          </span>

          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
            onClick={() => {
              removeTodo(todoItem.id);
            }}
          >
            ×
          </button>
        </>
      ) : (
        <React.Fragment key={todoItem.id}>
          <form>
            <input
              ref={editTodoRef}
              data-cy="TodoTitleField"
              type="text"
              className="todo__title-field"
              placeholder="Empty todo will be deleted"
              checked={todoItem.completed}
              value={editedTodo.title}
              onBlur={event => {
                event.preventDefault();
                if (!editedTodo.title.trim()) {
                  removeTodo(editedTodo.id).then(text => {
                    if (text === 'error') {
                      editTodoRef.current?.focus();
                    }
                  });
                } else {
                  onUpdateTitle(editedTodo);
                }
              }}
              onKeyUp={event => onKeyClick(event)}
              onKeyDown={event => onKeyClick(event, editedTodo)}
              onChange={event => {
                editOndDoubleClick(event);
              }}
            />
          </form>
        </React.Fragment>
      )}
      <div
        data-cy="TodoLoader"
        className={classNames('modal overlay', {
          'is-active': waiterLoading === todoItem.id,
        })}
      >
        <div
          className="modal-background
                                has-background-white-ter"
        />
        <div className="loader" />
      </div>
    </div>
  );
};
