/* eslint-disable jsx-a11y/control-has-associated-label */
import React, {
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import classNames from 'classnames';
import { Todo } from '../types/Todo';
import { TodoContext } from '../TodoContext';
import * as todoService from '../api/todos';
import { ErrorMessage } from '../utils/enums';

type Props = {
  todo: Todo;
};

export const TodoItem: React.FC<Props> = ({ todo }) => {
  const activeTodo = todo;
  const {
    deleteTodo,
    setTodos,
    todos,
    isSubmitting,
    isDeliting,
    selectedTodo,
    clear,
    setSelectedTodo,
    errorHandler,
  } = useContext(TodoContext);
  const [editing, setEditing] = useState(false);
  const [titleEdit, setTitleEdit] = useState(activeTodo.title);
  const [activeTitle, setActiveTitle] = useState(activeTodo.title);
  const [updating, setUpdating] = useState(false);

  const inputFocus = useRef<HTMLInputElement>(null);

  const updatingTodoOnServer = () => {
    todoService.updateTodo(activeTodo)
      .then((updatedTodo) => {
        const newTodos = [...todos];
        const index = newTodos.findIndex(t => t.id === updatedTodo.id);

        newTodos.splice(index, 1, updatedTodo);
        setTodos(newTodos);
      })
      .catch(() => {
        errorHandler(ErrorMessage.update);
        setTitleEdit(activeTodo.title);
        activeTodo.title = activeTitle;
        setActiveTitle(activeTitle);
        setTitleEdit(activeTitle);
      })
      .finally(() => {
        setUpdating(false);
        setSelectedTodo(0);
      });
    setEditing(false);
  };

  const activeLoader = (selectedTodo === activeTodo.id && isDeliting)
    || (selectedTodo === activeTodo.id && isSubmitting)
    || (clear && todo.completed)
    || (updating && selectedTodo === activeTodo.id);

  const handleCheckbox = () => {
    setUpdating(true);
    setSelectedTodo(activeTodo.id);
    if (!activeTodo.completed) {
      activeTodo.completed = true;
      // setCount(count - 1);
    } else {
      activeTodo.completed = false;
      // setCount(count + 1);
    }

    todoService.updateTodo(activeTodo)
      .then((updatedTodo) => {
        const newTodos = [...todos];
        const index = newTodos.findIndex(t => t.id === updatedTodo.id);

        newTodos.splice(index, 1, updatedTodo);
        setTodos(newTodos);
      })
      .catch(() => {
        errorHandler(ErrorMessage.update);
        if (!activeTodo.completed) {
          activeTodo.completed = true;
        } else {
          activeTodo.completed = false;
        }
      })
      .finally(() => {
        setUpdating(false);
        setSelectedTodo(0);
      });
  };

  const isChecked = activeTodo.completed;

  useEffect(() => {
    if (editing && inputFocus.current) {
      inputFocus.current.focus();
    }
  }, [editing]);

  const handleDoubleClick = () => {
    setEditing(true);
  };

  const handleEdit = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTitleEdit(event.target.value);
  };

  const handleKey = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter') {
      setSelectedTodo(activeTodo.id);
      setUpdating(true);
      if (!titleEdit.length) {
        return deleteTodo(activeTodo.id);
      }

      activeTodo.title = titleEdit;

      updatingTodoOnServer();
    }

    if (event.key === 'Escape') {
      setEditing(false);
      setTitleEdit(activeTodo.title);
    }

    return setTodos(todos);
  };

  const handleBlur = () => {
    setSelectedTodo(activeTodo.id);
    setUpdating(true);
    if (!titleEdit.length) {
      return deleteTodo(activeTodo.id);
    }

    activeTodo.title = titleEdit;

    return updatingTodoOnServer();
  };

  return (
    <li
      style={{ listStyle: 'none' }}
      className={classNames({
        completed: activeTodo.completed,
        editing,
      })}
    >
      <div
        data-cy="Todo"
        className={classNames('todo', {
          completed: isChecked === true,
        })}
      >
        <label className="todo__status-label ">
          <input
            data-cy="TodoStatus"
            type="checkbox"
            className="todo__status"
            onChange={handleCheckbox}
            checked={isChecked}
          />
        </label>

        <span
          data-cy="TodoTitle"
          className="todo__title"
          onDoubleClick={handleDoubleClick}
        >
          {editing ? (
            <form>
              <input
                data-cy="TodoTitleField"
                type="text"
                className="todo__title-field"
                placeholder="Empty todo will be deleted"
                ref={inputFocus}
                value={titleEdit}
                onChange={handleEdit}
                onKeyUp={handleKey}
                onBlur={handleBlur}
              />
            </form>
          ) : activeTodo.title}
        </span>
        {!editing && (
          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
            onClick={() => {
              deleteTodo(activeTodo.id);
            }}
          >
            ×
          </button>
        )}

        <div
          data-cy="TodoLoader"
          className={classNames('modal overlay', {
            'is-active': activeLoader,
          })}
        >
          <div className="modal-background has-background-white-ter" />
          <div className="loader" />
        </div>
      </div>
    </li>
  );
};
