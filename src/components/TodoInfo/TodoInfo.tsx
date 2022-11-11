import React, {
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import classNames from 'classnames';
import { Todo } from '../../types/Todo';

type Props = {
  todo: Todo,
  handleDeleteTodo:(todoId: number) => void,
  deletingTodosIds: number[],
  toggleTodo: (todoId: number, isCompleted: boolean) => void,
  changeTodoTitle: (todoId: number, title: string) => void,
  selectingTodoIds: number[],
};

export const TodoInfo: React.FC<Props> = ({
  todo,
  handleDeleteTodo,
  deletingTodosIds,
  toggleTodo,
  changeTodoTitle,
  selectingTodoIds,
}) => {
  const { title, completed, id } = todo;
  const [deletedTodoId, setdeletedTodoId] = useState(0);
  const [isRenamed, setIsRenamed] = useState(false);
  const [newTodoTitle, setNewTodoTitle] = useState(title);

  const titleInputField = useRef<HTMLInputElement>(null);

  const deleteTodo = useCallback((todoId: number) => {
    handleDeleteTodo(todoId);
    setdeletedTodoId(todoId);
  }, []);

  const activateRenaming = useCallback((event: React.MouseEvent) => {
    if (event.detail === 2) {
      setIsRenamed(true);
    }
  }, []);

  const closeRenaming = useCallback((event: React.KeyboardEvent) => {
    if (event.key === 'Escape') {
      setNewTodoTitle(title);
      setIsRenamed(false);
    }
  }, [newTodoTitle, isRenamed]);

  const submitNewTodoTitle = useCallback((event: React.FormEvent) => {
    event.preventDefault();

    if (newTodoTitle === title) {
      setNewTodoTitle(title);
      setIsRenamed(false);
    } else if (newTodoTitle === '') {
      deleteTodo(id);
    } else {
      changeTodoTitle(id, newTodoTitle);
      setIsRenamed(false);
    }
  }, [newTodoTitle]);

  useEffect(() => {
    if (titleInputField.current) {
      titleInputField.current.focus();
    }
  }, [isRenamed]);

  return (
    <div
      data-cy="Todo"
      className={classNames('todo',
        { completed })}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          defaultChecked
          onClick={() => toggleTodo(id, completed)}
        />
      </label>

      {isRenamed
        ? (
          <form
            onSubmit={submitNewTodoTitle}
            onBlur={submitNewTodoTitle}
          >
            <input
              data-cy="TodoTitleField"
              type="text"
              className="todo__title-field"
              placeholder="Empty todo will be deleted"
              ref={titleInputField}
              defaultValue={newTodoTitle}
              onChange={event => setNewTodoTitle(event.target.value)}
              onKeyDown={closeRenaming}
            />
          </form>
        )
        : (
          /* eslint-disable jsx-a11y/click-events-have-key-events, jsx-a11y/no-noninteractive-element-interactions */
          <>
            <span
              data-cy="TodoTitle"
              role="button"
              tabIndex={0}
              className="todo__title"
              onClick={event => activateRenaming(event)}
            >
              {title}
            </span>

            <button
              type="button"
              className="todo__remove"
              data-cy="TodoDeleteButton"
              onClick={() => deleteTodo(id)}
            >
              x
            </button>
          </>
        )}

      <div
        data-cy="TodoLoader"
        className={classNames(
          'modal overlay',
          {
            'is-active': id === deletedTodoId
              || deletingTodosIds.includes(id)
              || selectingTodoIds.includes(id),
          },
        )}
      >
        <div
          className="modal-background has-background-white-ter"
        />
        <div className="loader" />
      </div>
    </div>
  );
};
