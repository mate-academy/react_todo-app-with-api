import classNames from 'classnames';
import { useState } from 'react';
import { Todo } from '../../types/Todo';
import { Loader } from './Loader';

type Props = {
  todo: Todo;
  updateTODOCompleted: (todoId: number | undefined, completed: boolean) => void;
  removeTodo: (todoId: number | undefined) => void;
  updateTODOTitle: (todoId: number | undefined, title: string) => void;
};

export const TodoInfo: React.FC<Props> = ({
  todo,
  updateTODOCompleted,
  removeTodo,
  updateTODOTitle,
}) => {
  const [isVisible, setIsVisible] = useState(true);
  const [currentTodoId, setCurrentTodoId] = useState(3);
  const [value, setValue] = useState<string>(todo.title);

  const handle = (
    event: React.KeyboardEvent<HTMLSpanElement>,
    id: number,
    title: string,
  ) => {
    if (event.key === 'Enter') {
      if (value === '') {
        removeTodo(id);

        return;
      }

      updateTODOTitle(id, title);
      setCurrentTodoId(0);
      setIsVisible(true);
    }
  };

  const handleKeyUp = (
    event: React.KeyboardEvent<HTMLSpanElement>,
    id: number,
    title: string,
  ) => {
    if (event.key === 'Escape') {
      updateTODOTitle(id, title);
      setIsVisible(true);
      setCurrentTodoId(0);
    }
  };

  return (
    <div
      data-cy="Todo"
      className={classNames('todo', {
        'todo completed': todo.completed,
      })}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          defaultChecked
          onClick={() => {
            updateTODOCompleted(todo.id, !todo.completed);
            setIsVisible(true);
          }}
        />
      </label>

      {isVisible && currentTodoId !== todo.id ? (
        <>
          <Loader />
          <span
            aria-hidden="true"
            data-cy="TodoTitle"
            className="todo__title"
            onClick={() => setCurrentTodoId(todo.id)}
            onDoubleClick={() => {
              setValue(todo.title);
              setIsVisible(false);
            }}
          >
            {todo.title}
          </span>
          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDeleteButton"
            onClick={() => removeTodo(todo.id)}
          >
            ×
          </button>
        </>
      ) : (
        <form>
          <input
            data-cy="TodoTitleField"
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            value={value}
            onChange={(event) => {
              setValue(event.target.value);
            }}
            onKeyUp={(event) => {
              handleKeyUp(event, todo.id, value);
            }}
            onKeyDown={(event) => {
              handle(event, todo.id, value);
            }}
            onBlur={() => {
              updateTODOTitle(todo.id, value);
              setIsVisible(true);
              setCurrentTodoId(0);
            }}
          />
        </form>
      )}
    </div>
  );
};
