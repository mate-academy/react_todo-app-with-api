import classNames from 'classnames';
import { useEffect, useState } from 'react';
import { Todo } from '../../types/Todo';
import { updateTodoById } from '../../api/todos';

interface Props {
  todo: Todo;
  selectedTodoId: number;
  onDeleteTodo: (todoId: number) => void;
  onError: (errorTitle: string) => void;
  handleUpdate: (isUpdated: boolean) => void;
}

export const TodoItem = (props: Props) => {
  const {
    todo,
    selectedTodoId,
    onDeleteTodo,
    onError,
    handleUpdate,
  } = props;

  const [isDblClicked, setIsDblClicked] = useState(false);
  const [title, setTitle] = useState(todo.title);
  const [isChecked, setIsChecked] = useState(todo.completed);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedTodoById, setSelectedTodoById] = useState(selectedTodoId);

  useEffect(() => {
    setIsLoading(true);

    setTimeout(() => setIsLoading(false), 500);
  }, [setIsLoading]);

  const updateTodo = (todoId: number, data: {}) => {
    setIsLoading(true);
    setSelectedTodoById(todoId);

    updateTodoById(todoId, data)
      .then(() => handleUpdate(true))
      .catch(() => onError('Unable to update a todo'))
      .finally(() => setIsLoading(false));
  };

  return (
    <div
      data-cy="Todo"
      className={classNames('todo', { completed: isChecked })}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          defaultChecked={isChecked}
          onChange={(e) => {
            setIsChecked(e.target.checked);
            updateTodo(todo.id, { completed: e.target.checked });
          }}
        />
      </label>

      {isDblClicked ? (
        <form onSubmit={(e) => {
          e.preventDefault();
          updateTodo(todo.id, { title });
        }}
        >
          <input
            data-cy="TodoTitleField"
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            defaultValue={title}
            onBlur={(e) => {
              e.preventDefault();
              setIsDblClicked(false);
              setIsLoading(true);
              updateTodo(todo.id, { title });
            }}
            onChange={(e) => {
              setTitle(e.target.value);
            }}
          />
        </form>
      ) : (
        <>
          <span
            data-cy="TodoTitle"
            className="todo__title"
            onDoubleClick={() => setIsDblClicked(true)}
          >
            {todo.title}
          </span>
          {!isLoading && (
            <button
              type="button"
              className="todo__remove"
              data-cy="TodoDeleteButton"
              onClick={() => {
                onDeleteTodo(todo.id);
                setIsLoading(true);
              }}
            >
              ×
            </button>
          )}
        </>
      )}

      {todo.id === selectedTodoById && (
        <div
          data-cy="TodoLoader"
          className={classNames(
            'modal overlay',
            { 'is-active': isLoading },
          )}
        >
          <div className="modal-background has-background-white-ter" />
          <div className="loader" />
        </div>
      )}
    </div>
  );
};
