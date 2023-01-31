import classNames from 'classnames';
import React, {
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import { Todo } from '../../types/Todo';
import { LoaderContext } from '../Context/LoadingContext';

type Props = {
  todo: Todo,
  isAdding?: boolean,
  deletingTodo?: (id: number) => void,
  changeTodo: (id: number, changes: Partial<Todo>) => void,
};

export const TodoInfo: React.FC<Props> = ({
  todo,
  isAdding,
  deletingTodo,
  changeTodo,
}) => {
  const { title, id, completed } = todo;

  const [isLoading, setIsLoading] = useState(false);
  const [isFormExist, setIsFormExist] = useState(false);
  const [newTitle, setNewTitle] = useState(title);

  const { idsForLoader } = useContext(LoaderContext);
  const todoField = useRef<HTMLInputElement>(null);
  const loaderCondition = isAdding || isLoading || idsForLoader.includes(id);

  useEffect(() => {
    if (todoField.current) {
      todoField.current.focus();
    }
  }, [isFormExist]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        todoField.current?.blur();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const handleTodoRemoval = async () => {
    if (deletingTodo) {
      setIsLoading(true);

      await deletingTodo(id);

      setIsLoading(false);
    }
  };

  const handlerForUpdatingTodo = async () => {
    if (changeTodo) {
      setIsLoading(true);

      if (!completed) {
        await changeTodo(id, { completed: true });
      } else {
        await changeTodo(id, { completed: false });
      }

      setIsLoading(false);
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (newTitle.trim() === '') {
      handleTodoRemoval();
    }

    if (newTitle !== title && newTitle.trim() !== '') {
      setIsLoading(true);
      setIsFormExist(false);
      await changeTodo(id, { title: newTitle });
      setIsLoading(false);
    }

    setIsFormExist(false);
  };

  return (
    <div
      data-cy="Todo"
      className={classNames('todo', { completed })}
    >
      <label
        className="todo__status-label"
        onChange={handlerForUpdatingTodo}
      >
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
        />
      </label>

      {isFormExist
        ? (
          <form onSubmit={handleSubmit}>
            <input
              data-cy="TodoTitleField"
              type="text"
              ref={todoField}
              onBlur={handleSubmit}
              className="todo__title-field"
              placeholder="Empty todo will be deleted"
              value={newTitle}
              onChange={(event) => {
                setNewTitle(event.target.value);
              }}
            />
          </form>
        )
        : (
          <>
            <span
              onClickCapture={(event) => {
                if (event.detail === 2) {
                  setIsFormExist(true);
                }
              }}
              data-cy="TodoTitle"
              className="todo__title"
            >
              {title}
            </span>

            <button
              type="button"
              className="todo__remove"
              data-cy="TodoDeleteButton"
              onClick={handleTodoRemoval}
            >
              ×
            </button>
          </>
        )}
      <div
        data-cy="TodoLoader"
        className={classNames(
          'modal overlay',
          {
            'is-active': loaderCondition,
          },
        )}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
