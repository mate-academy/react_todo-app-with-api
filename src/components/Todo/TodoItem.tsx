import React, { useEffect, useRef, useState } from 'react';
import { Todo } from '../../types/Todo';
import { PatchTodoFragment } from '../../types/TodoFragment';

interface Props {
  todo: Todo;
  removeTodo:(arg: number) => void;
  changeTodo: (arg1: number, arg2: PatchTodoFragment) => void;
  activeTodo: number[];
}

export const TodoItem:React.FC<Props> = (props) => {
  const {
    todo,
    removeTodo,
    changeTodo,
    activeTodo,
  } = props;
  const [showInput, setShowInput] = useState(false);
  const [inputTitle, setInputTitle] = useState(todo.title);

  const focusField = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // focus the element with `ref={newTodoField}`
    if (focusField.current) {
      focusField.current.focus();
    }
  }, [showInput]);

  return (
    <div
      data-cy="Todo"
      className={todo.completed ? 'todo completed' : 'todo'}
      key={todo.id}
    >

      <label
        className="todo__status-label"
      >
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          onClick={() => {
            changeTodo(todo.id, { completed: !todo.completed });
          }}
        />
      </label>

      {showInput
        ? (
          <form onSubmit={(e) => {
            e.preventDefault();
            changeTodo(todo.id, { title: inputTitle });
            setShowInput(false);
          }}
          >
            <input
              type="text"
              className="todo__title-field"
              value={inputTitle}
              onChange={(e) => setInputTitle(e.target.value)}
              onBlur={() => setShowInput(false)}
              ref={focusField}
              onKeyDown={(e) => {
                if (e.key === 'Escape') {
                  setShowInput(false);
                }
              }}
            />
          </form>
        )
        : (
          <>
            <span
              data-cy="TodoTitle"
              className="todo__title"
              onDoubleClick={() => setShowInput(true)}
            >
              {todo.title}
            </span>
            <button
              type="button"
              className="todo__remove"
              data-cy="TodoDeleteButton"
              onClick={() => {
                removeTodo(todo.id);
              }}
            >
              ×
            </button>
          </>
        )}

      { activeTodo.includes(todo.id) && (
        <div data-cy="TodoLoader" className="modal overlay is-active">
          <div className="modal-background has-background-white-ter" />
          <div className="loader" />
        </div>
      )}
    </div>
  );
};
