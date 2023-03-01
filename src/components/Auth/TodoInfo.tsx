import classNames from 'classnames';
import { useState } from 'react';
import { Todo } from '../../types/Todo';
import { Loader } from './Loader';

type Props = {
  todo: Todo;
  updateTODOCompleted: (todoNew: Todo) => void;
  removeTodo: (todoId: number | undefined) => void;
  updateTODOTitle: (todoId: number | undefined, title: string) => void;
  isLoadingNewName: boolean;
};

export const TodoInfo: React.FC<Props> = ({
  todo,
  updateTODOCompleted,
  removeTodo,
  updateTODOTitle,
  isLoadingNewName,
}) => {
  const [isVisible, setIsVisible] = useState(true);
  const [currentTodoId, setCurrentTodoId] = useState(0);
  const [value, setValue] = useState<string>(todo.title);

  const onBlur = (id: number, val: string) => {
    updateTODOTitle(id, val);
    setIsVisible(true);
    setCurrentTodoId(0);
  };

  const handle = (
    event: React.KeyboardEvent<HTMLInputElement>,
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
    event: React.KeyboardEvent<HTMLInputElement>,
    id: number,
    title: string,
  ) => {
    if (event.key === 'Escape') {
      updateTODOTitle(id, title);
      setCurrentTodoId(0);
      setIsVisible(true);
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
            updateTODOCompleted(todo);
            setIsVisible(true);
          }}
        />
      </label>

      {isVisible && currentTodoId !== todo.id ? (

        <>
          {' '}
          {isLoadingNewName ? <Loader /> : (
            <>
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
          )}
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
              onBlur(todo.id, value);
            }}
          />
        </form>
      )}
    </div>
  );
};
