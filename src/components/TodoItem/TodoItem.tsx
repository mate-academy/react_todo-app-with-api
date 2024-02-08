import { useEffect, useRef } from 'react';
import { useSignal, useSignals } from '@preact/signals-react/runtime';
import classNames from 'classnames';
import { Todo } from '../../types/Todo';
import {
  isError, todos, todosToLoad,
} from '../../signals';
import { deleteTodo, updateTodo } from '../../api/todos';
import { ErrorValues } from '../../types/ErrorValues';
import { Keys } from '../../types/KeyboardKeys';

type Props = {
  todo: Todo;
};

export const TodoItem = ({ todo }: Props) => {
  useSignals();

  const { id, title, completed } = todo;
  const isLoading = todosToLoad.value.includes(id);
  const todoIsEditing = useSignal<boolean>(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const inputValue = useSignal<string>(title);

  const handleDelete = () => {
    todosToLoad.value = [...todosToLoad.value, id];
    deleteTodo(id)
      .then(() => {
        todos.value = todos.value.filter((t) => t.id !== id);
      })
      .catch(() => {
        isError.value = ErrorValues.delete;
      })
      .finally(() => {
        todosToLoad.value = todosToLoad.value.filter((t) => t !== id);
      });
  };

  const handleCheckboxChange = () => {
    todosToLoad.value = [...todosToLoad.value, id];
    updateTodo({ id, title, completed: !completed })
      .then((updatedTodo) => {
        todos.value = todos.value.map((t) => (t.id === id ? updatedTodo : t));
      })
      .catch(() => {
        isError.value = ErrorValues.update;
      })
      .finally(() => {
        todosToLoad.value = todosToLoad.value.filter((t) => t !== id);
      });
  };

  const handleDoubleClick = () => {
    todoIsEditing.value = true;
  };

  useEffect(() => {
    if (inputRef.current && todoIsEditing.value) {
      inputRef.current.focus();
    }
  }, [todoIsEditing.value]);

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    inputValue.value = e.target.value;
  };

  const finishEditing = () => {
    if (inputValue.value.trim() === title) {
      todoIsEditing.value = false;

      return;
    }

    if (inputValue.value.trim()) {
      todosToLoad.value = [...todosToLoad.value, id];
      updateTodo({
        id,
        title: inputValue.value.trim(),
        completed,
      })
        .then((updatedTodo) => {
          todos.value = todos.value.map((t) => (t.id === id ? updatedTodo : t));
        })
        .catch(() => {
          isError.value = ErrorValues.update;
        })
        .finally(() => {
          todosToLoad.value = todosToLoad.value.filter((t) => t !== id);
          todoIsEditing.value = false;
        });
    } else {
      handleDelete();
    }
  };

  const handleOnKeyUp = (e: React.KeyboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.key === Keys.Escape) {
      inputValue.value = title;
      todoIsEditing.value = false;
    }
  };

  const handleOnSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    finishEditing();
  };

  return (
    <div
      data-cy="Todo"
      className={classNames('todo', { completed })}
      onDoubleClick={handleDoubleClick}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={completed}
          onChange={handleCheckboxChange}
        />
      </label>

      {todoIsEditing.value ? (
        <form onSubmit={handleOnSubmit}>
          <input
            data-cy="TodoTitleField"
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            value={inputValue.value}
            ref={inputRef}
            onInput={handleInput}
            onBlur={finishEditing}
            onKeyUp={handleOnKeyUp}
          />
        </form>
      ) : (
        <>
          <span data-cy="TodoTitle" className="todo__title">
            {title}
          </span>

          {/* Remove button appears only on hover */}
          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
            onClick={handleDelete}
          >
            ×
          </button>
        </>
      )}

      {/* overlay will cover the todo while it is being updated */}
      <div
        data-cy="TodoLoader"
        className={classNames(
          'modal',
          'overlay',
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
