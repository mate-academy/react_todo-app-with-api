import {
  FC, useEffect, useRef, useState,
} from 'react';
import classNames from 'classnames';
import { Todo } from '../../types/Todo';
import { updateTodo } from '../../api/todos';
import { Errors } from '../../types/Errors';

type Props = {
  filteredTodos: Todo[];
  tempTodo: Todo | null;
  removeTodo: (id: number) => void;
  waitingResponse: number[];
  todos: Todo[];
  setTodos: (todos: Todo[]) => void;
  setErrors: (errors: Errors) => void;
  setWaitingResponse: (id: number[]) => void;
};

export const Main: FC<Props> = ({
  filteredTodos,
  tempTodo,
  removeTodo,
  waitingResponse,
  setWaitingResponse,
  todos,
  setTodos,
  setErrors,
}) => {
  const [isEdited, setIsEdited] = useState<number | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [inputValue, setInputValue] = useState('');
  const [ogTitle, setOgTitle] = useState('');

  const handleUpdate = async (todo: Todo) => {
    try {
      setWaitingResponse([todo.id!]);
      await updateTodo(todo.id!, { completed: !todo.completed });
      setTodos(
        todos.map((todoItem) => (todoItem.id === todo.id
          ? { ...todo, completed: !todo.completed }
          : todoItem)),
      );
      setWaitingResponse([]);
    } catch (error) {
      setErrors({ editing: true });
      setWaitingResponse([]);
    }
  };

  const updateTitle = async (id: number, title: string) => {
    setIsEdited(null);
    try {
      setWaitingResponse([id]);
      if (title === '') {
        removeTodo(id);
      } else {
        await updateTodo(id, { title });
      }

      setTodos(
        todos.map((todoItem) => (
          todoItem.id === id ? { ...todoItem, title } : todoItem
        )),
      );
      setWaitingResponse([]);
    } catch (error) {
      setErrors({ editing: true });
      setWaitingResponse([]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  useEffect(() => {
    if (isEdited) {
      inputRef.current?.focus();
    }
  }, [isEdited]);

  const handkeKeyUp = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Escape') {
      setIsEdited(null);
    }
  };

  if (isEdited !== null) {
    inputRef.current?.focus();
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (ogTitle !== inputValue) {
      updateTitle(isEdited!, inputValue);
    } else {
      setIsEdited(null);
    }
  };

  return (
    <section className="todoapp__main">
      {filteredTodos?.map((todo) => (
        <>
          <div
            key={todo.id}
            className={classNames('todo', { completed: todo.completed })}
          >
            {waitingResponse.includes(todo.id!) && (
              <div className="modal overlay is-active">
                <div className="modal-background has-background-white-ter" />
                <div className="loader" />
              </div>
            )}
            <label className="todo__status-label">
              <input
                onClick={() => handleUpdate(todo)}
                checked={todo.completed}
                type="checkbox"
                className="todo__status"
              />
            </label>

            {isEdited === todo.id && (
              <form onSubmit={handleSubmit}>
                <input
                  type="text"
                  className="todo__title-field"
                  placeholder="Empty todo will be deleted"
                  value={inputValue}
                  onChange={handleChange}
                  onKeyUp={handkeKeyUp}
                  onBlur={() => handleSubmit}
                  ref={inputRef}
                />
              </form>
            )}

            {isEdited !== todo.id && (
              <>
                <span
                  onDoubleClick={() => {
                    setIsEdited(todo.id!);
                    setInputValue(todo.title);
                    setOgTitle(todo.title);
                  }}
                  className="todo__title"
                >
                  {todo.title}
                </span>

                <button
                  type="button"
                  onClick={() => removeTodo(todo.id!)}
                  className="todo__remove"
                >
                  ×
                </button>
              </>
            )}

            {/* overlay will cover the todo while it is being updated */}
          </div>
        </>
      ))}
      {tempTodo && (
        <div className="todo">
          <div className="modal overlay is-active">
            <div className="modal-background has-background-white-ter" />
            <div className="loader" />
          </div>
          <label className="todo__status-label">
            <input type="checkbox" className="todo__status" />
          </label>

          <span className="todo__title">{tempTodo.title}</span>
        </div>
      )}
    </section>
  );
};
