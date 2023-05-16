import React, { useContext, useState, useRef } from 'react';
import classNames from 'classnames';
import { Todo } from './types/Todo';
import { TodosContext } from './TodoContext';
import { deleteTodos, updateTodos, renameTodos } from './api/todos';

type Props = {
  currentTodo: Todo,
};

export const TodoCard: React.FC<Props> = ({ currentTodo }) => {
  const [updatedTitle, setUpdatedTitle] = useState(currentTodo.title);
  const inputRef = useRef<HTMLInputElement>(null);

  const {
    todos,
    setTodos,
    isMouseEnter,
    setIsMouseEnter,
    setIsDeleteError,
    selectedTodo,
    setSelectedTodo,
    setIsUpdateError,
  } = useContext(TodosContext);

  const findTodo = (todo: Todo) => {
    return todos.findIndex(el => el.id === todo.id);
  };

  const remove = async () => {
    setIsDeleteError(false);

    try {
      const response = await deleteTodos(currentTodo.id);

      if (response !== 0) {
        setTodos(
          todos.filter(todo => todo.id !== currentTodo.id),
        );
      } else {
        setIsDeleteError(true);
      }
    } catch {
      setIsDeleteError(true);
    }
  };

  const rename = async () => {
    setIsUpdateError(false);

    try {
      await renameTodos(
        todos[findTodo(currentTodo)].id,
        updatedTitle,
      );

      setTodos(
        [...todos.slice(0, findTodo(currentTodo)),
          {
            ...currentTodo,
            title: updatedTitle,
          },
          ...todos.slice(findTodo(currentTodo) + 1)],
      );
    } catch {
      setIsUpdateError(true);
    }
  };

  const updateHandler = () => {
    if (updatedTitle === '') {
      remove();
    }

    if (updatedTitle !== currentTodo.title) {
      rename();
    }

    setSelectedTodo(null);
  };

  return (
    <div
      className={classNames(
        'todo', { completed: todos[findTodo(currentTodo)].completed },
      )}
      key={currentTodo.title}
      onMouseEnter={() => setIsMouseEnter(true)}
      onMouseLeave={() => setIsMouseEnter(false)}
    >
      <label className="todo__status-label">
        <input
          type="checkbox"
          className="todo__status"
          checked={todos[findTodo(currentTodo)].completed}
          onChange={() => {
            updateTodos(
              todos[findTodo(currentTodo)].id,
              !todos[findTodo(currentTodo)].completed,
            );

            setTodos(
              [...todos.slice(0, findTodo(currentTodo)),
                {
                  ...currentTodo,
                  completed: !todos[findTodo(currentTodo)].completed,
                },
                ...todos.slice(findTodo(currentTodo) + 1)],
            );
          }}
        />
      </label>

      {currentTodo === selectedTodo ? (
        <label
          htmlFor="todo__title_input"
        >
          <form
            action=""
            className={classNames(
              'todo__title',
              { 'todo__title--form': selectedTodo === currentTodo },
            )}
            onSubmit={(event) => {
              event.preventDefault();

              updateHandler();
            }}
          >
            <input
              className="todo__title_input"
              ref={inputRef}
              id="todo__title_input"
              type="text"
              placeholder="Empty todo will be deleted"
              value={updatedTitle}
              onBlur={() => updateHandler()}
              onChange={(event) => {
                setUpdatedTitle(event.target.value);
              }}
              onKeyUp={(event) => {
                if (event.key === 'Escape') {
                  setUpdatedTitle(currentTodo.title);
                  setSelectedTodo(null);
                }
              }}
            />
          </form>
        </label>
      ) : (
        <div
          className="todo__title"
          role="button"
          tabIndex={0}
          onDoubleClick={() => {
            setSelectedTodo(currentTodo);
            if (inputRef.current) {
              inputRef.current.focus();
            }
          }}
        >
          {currentTodo.title}
        </div>
      )}

      {(isMouseEnter && currentTodo !== selectedTodo) && (
        <button
          type="button"
          className="todo__remove"
          onClick={() => remove()}
        >
          ×
        </button>
      )}

      <div className="modal overlay">
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
