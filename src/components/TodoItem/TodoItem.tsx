import { FC, useState, useEffect } from 'react';
import { Todo } from '../../types/Todo/Todo';
import classNames from 'classnames';
import { useTodoContext } from '../../context/TodoContext';
import { useTodoActions } from '../../utils/hooks/useTodoActions';
import { useFocus } from '../../utils/hooks/useFocus';
import { ErrorMessages } from '../../types/ErrorMessages/ErrorMessages';

type Props = { todo: Todo };

export const TodoItem: FC<Props> = ({
  todo: { id, title: todoTitle, completed },
}) => {
  const {
    loadingTodoIds,
    showError,
    setLoadingTodoIds,
    setLockedFocus,
    setErrorMessage,
  } = useTodoContext();

  const { inputRef, setFocus } = useFocus();
  const { editTodo, deleteTodo, delateOneTodo } = useTodoActions();
  const [isEditing, setIsEditing] = useState(false);
  const [value, setValue] = useState(todoTitle);

  const handleTitleEdit = async () => {
    const formattedTitle = value.trim();

    setValue(formattedTitle);

    if (value === todoTitle) {
      setIsEditing(false);

      return;
    }

    if (!formattedTitle) {
      setErrorMessage('');

      return delateOneTodo(id);
    }

    try {
      await editTodo(id, { title: formattedTitle.trim() });
      setIsEditing(false);
    } catch (error) {
      setLockedFocus(true);
    }
  };

  const handleToggleCompleted = async () => {
    setLoadingTodoIds([id]);
    try {
      await editTodo(id, { completed: !completed });
    } catch (error) {
      showError(ErrorMessages.Update);
    } finally {
      setLoadingTodoIds(null);
    }
  };

  const handleDoubleClick = () => {
    setIsEditing(true);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    handleTitleEdit();
  };

  const handleKeyUp: React.KeyboardEventHandler<HTMLFormElement> = event => {
    if (event.key === 'Escape') {
      setValue(todoTitle);
      setIsEditing(false);
    }
  };

  useEffect(() => {
    if (isEditing) {
      setLockedFocus(true);
    }
  }, [isEditing, setLockedFocus, inputRef]);

  return (
    <div
      data-cy="Todo"
      className={classNames('todo', {
        completed: completed,
      })}
      key={id}
    >
      <label className="todo__status-label">
        <input
          aria-label={`Mark ${value} as ${completed ? 'incomplete' : 'complete'}`}
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          onChange={handleToggleCompleted}
          checked={completed}
        />
      </label>

      {isEditing ? (
        <form onSubmit={handleSubmit} onKeyUp={handleKeyUp}>
          <input
            ref={el => setFocus(el)}
            data-cy="TodoTitleField"
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            value={value}
            onChange={e => setValue(e.target.value)}
            onBlur={handleTitleEdit}
          />
        </form>
      ) : (
        <span
          data-cy="TodoTitle"
          className="todo__title"
          onDoubleClick={handleDoubleClick}
        >
          {value}
        </span>
      )}

      {!isEditing && (
        <button
          type="button"
          className="todo__remove"
          data-cy="TodoDelete"
          onClick={() => deleteTodo([id])}
        >
          ×
        </button>
      )}

      <div
        data-cy="TodoLoader"
        className={classNames('modal overlay', {
          'is-active': loadingTodoIds?.includes(id),
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
