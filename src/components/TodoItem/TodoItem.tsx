import classNames from 'classnames';
import { useEffect, useRef, useState } from 'react';
import { Todo } from '../../types/Todo';

type Props = {
  todo: Todo,
  isAdding: boolean,
  selectedTodoId: number | null,
  isLoader: boolean,
  isLoaderCompletedTodo: boolean,
  isLoaderUnCompletedTodo: boolean,
  completedTodosIds: number[],
  unCompletedTodosIds: number[],
  isDoubleClick: boolean,
  handlerTodoDoubleClick: (id: number, titleValue: string) => void,
  handlerTodoDeleteButton: (id: number) => void,
  handlerChangeTodoStatus: (
    event: React.ChangeEvent<HTMLInputElement>,
    id: number,
    completed: boolean,
    getChandedStatus: (value: boolean) => void,
  ) => void,
  changedTodoTitle: string,
  setChangedTodoTitle: (value: string) => void,
  setIsDoubleClick: (value: boolean) => void,
  handlerSubmitNewTodoTitleField: (oldTodotitle: string, id: number) => void,
};

export const TodoItem: React.FC<Props> = ({
  todo,
  isAdding,
  selectedTodoId,
  isLoader,
  isLoaderCompletedTodo,
  isDoubleClick,
  isLoaderUnCompletedTodo,
  completedTodosIds,
  unCompletedTodosIds,
  changedTodoTitle,
  setChangedTodoTitle,
  setIsDoubleClick,
  handlerTodoDoubleClick,
  handlerTodoDeleteButton,
  handlerChangeTodoStatus,
  handlerSubmitNewTodoTitleField,
}) => {
  const { title, completed, id } = todo;

  const [checkedStatus, setCheckedStatus] = useState(completed);

  const conditionForLoader = (isAdding && id === 0)
  || (isLoader && selectedTodoId === id)
  || (isLoaderCompletedTodo && completedTodosIds.includes(id))
  || (isLoaderUnCompletedTodo && unCompletedTodosIds.includes(id));

  const newTitleField = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (newTitleField.current) {
      newTitleField.current.focus();
    }
  });

  return (
    <div
      data-cy="Todo"
      className={classNames('todo', { completed })}
      onDoubleClick={() => handlerTodoDoubleClick(id, title)}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={checkedStatus}
          onChange={(event) => {
            handlerChangeTodoStatus(event, id, completed, setCheckedStatus);
          }}
        />
      </label>

      {(isDoubleClick && selectedTodoId === id) ? (
        <form
          onSubmit={(event) => {
            event.preventDefault();
            handlerSubmitNewTodoTitleField(title, id);
          }}
        >
          <input
            ref={newTitleField}
            data-cy="TodoTitleField"
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            value={changedTodoTitle}
            onChange={(event) => setChangedTodoTitle(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === 'Escape') {
                setIsDoubleClick(false);
              }
            }}
            onBlur={() => handlerSubmitNewTodoTitleField(title, id)}
          />
        </form>
      ) : (
        <>
          <span data-cy="TodoTitle" className="todo__title">
            {title}
          </span>
          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDeleteButton"
            onClick={() => handlerTodoDeleteButton(id)}
          >
            ×
          </button>
        </>
      )}

      {conditionForLoader && (
        <div
          data-cy="TodoLoader"
          className="modal overlay is-active"
        >
          <div className="modal-background has-background-white-ter" />
          <div className="loader" />
        </div>
      )}
    </div>
  );
};
