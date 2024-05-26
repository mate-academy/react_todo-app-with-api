import React, {
  useContext, useEffect, useRef, useState,
} from 'react';
import classNames from 'classnames';
import { Todo } from '../../types/Todo';
import { Loader } from '../Loader';
import { TodoContext } from '../../contexts/TodoContext';

type Props = {
  todo: Todo,
};

export const TodoItem: React.FC<Props> = ({
  todo,
}) => {
  const inputRef = useRef<HTMLInputElement | null>(null);

  const {
    editTodo,
    setEditTodo,
    changeData,
    deleteData: deleteTodo,
    activeLoader,
  } = useContext(TodoContext);

  const [inputValue, setInputValue] = useState('');

  const blurHendler = () => {
    if (inputValue === todo.title) {
      setEditTodo(-1);
    }

    if (inputValue.trim().length === 0) {
      deleteTodo(todo.id);
    } else {
      changeData(
        todo.id,
        inputValue.trim(),
        todo.completed,
      );
    }
  };

  const keyUpHendler = (event: React.KeyboardEvent<HTMLInputElement>) => {
    event.preventDefault();

    if (event.key === 'Escape' || event.key === 'Esc') {
      setEditTodo(-1);
    }
  };

  const submitHendler = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (inputValue === todo.title) {
      setEditTodo(-1);
    } else {
      changeData(
        todo.id,
        inputValue.trim(),
        todo.completed,
      );
    }
  };

  useEffect(() => {
    if (editTodo) {
      inputRef.current?.focus();
    }
  }, [editTodo]);

  return (
    <div
      key={todo.id}
      data-cy="Todo"
      className={
        classNames('todo', {
          completed: todo.completed,
        })
      }
      onDoubleClick={() => {
        setInputValue(todo.title);
        setEditTodo(todo.id);
      }}
    >
      <label
        aria-label="set input value"
        htmlFor={todo.id.toString()}
        className="todo__status-label"
      >
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          name="complete"
          id={todo.id.toString()}
          checked={todo.completed}
          onChange={() => {
            changeData(
              todo.id,
              todo.title,
              !todo.completed,
            );
          }}
        />
      </label>
      {editTodo === todo.id
        ? (
          <form
            onSubmit={submitHendler}
          >
            <input
              data-cy="TodoTitleField"
              className="todo__title-field"
              placeholder="Empty todo will be deleted"
              type="text"
              value={inputValue}
              onChange={(event) => {
                setInputValue(event.target.value);
              }}
              ref={inputRef}
              onBlur={blurHendler}
              onKeyUp={(event) => keyUpHendler(event)}
            />
          </form>
        )
        : (
          <>
            <span
              data-cy="TodoTitle"
              className="todo__title"
            >
              {todo.title}
            </span>
            <button
              data-cy="TodoDelete"
              type="button"
              className="todo__remove"
              onClick={() => deleteTodo(todo.id)}
            >
              X
            </button>
          </>
        )}

      <Loader
        todo={todo}
        activeLoader={activeLoader}
      />
    </div>
  );
};
