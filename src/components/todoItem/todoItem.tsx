import classNames from 'classnames';
import { useEffect } from 'react';
import { useTodos } from '../../context/todoProvider';
import { Todo } from '../../types/Todo';
import { ErrorType } from '../../types/Error';
import { updateTodo } from '../../api/todos';

type Props = {
  task: Todo;
  handleDeleteClick: (id: number) => void;
};

export const TodoItem = ({ task, handleDeleteClick }: Props) => {
  const {
    deletingTask, setError, todos, setTodos,
    togglingId, setTogglingId, isEdited, setIsEdited,
    isAddingTask, setIsAddingTask, inputEditRef, toggleTodo,
  } = useTodos();

  useEffect(() => {
    if (isEdited && inputEditRef?.current) {
      inputEditRef?.current.focus();
    }
  }, [inputEditRef, isEdited]);

  const toggleTodoStatus = (id: number) => {
    setError(null);
    const todo = todos.find(el => el.id === id);
    const currentTogglingId = [...togglingId, id];

    const current = id;

    setTogglingId(currentTogglingId);

    updateTodo(id, { completed: !todo?.completed })
      .then((data) => {
        setTodos((currentTodos: Todo[]) => {
          return currentTodos.map(el => (el.id === id ? data : el));
        });
      })
      .catch(() => setError(ErrorType.update))
      .finally(() => setTogglingId((currentId: number[]) => {
        return currentId.filter(el => el !== current);
      }));
  };

  const handleTitleChange = (id: number) => () => {
    setError(null);
    setIsEdited(id);
  };

  const handleSaveEdited = (event: React.FormEvent<HTMLFormElement>) => {
    setError(null);
    event.preventDefault();
    setIsAddingTask(true);

    toggleTodo();
  };

  const handleBlur = (id: number) => {
    setError(null);

    if (inputEditRef?.current?.defaultValue === inputEditRef?.current?.value) {
      setIsEdited(null);

      return;
    }

    if (inputEditRef?.current?.value === '') {
      handleDeleteClick(id);

      return;
    }

    setIsAddingTask(true);

    toggleTodo();
  };

  const handleEditFieldKeyUp = (event: React.KeyboardEvent) => {
    switch (event.key) {
      case 'Enter':
        inputEditRef?.current?.blur();
        break;
      case 'Escape':
        setIsEdited(null);
        break;
      default:
        break;
    }
  };

  return (
    <div
      key={task.id}
      data-cy="Todo"
      className={classNames('todo', {
        completed: task.completed,
      })}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={task.completed}
          onChange={() => toggleTodoStatus(task.id)}
        />
      </label>

      {isEdited === task.id
        ? (
          <form onSubmit={handleSaveEdited}>
            <input
              data-cy="TodoTitleField"
              type="text"
              className="todo__title-field"
              placeholder="Empty todo will be deleted"
              defaultValue={task.title.trim()}
              onBlur={() => handleBlur(task.id)}
              ref={inputEditRef}
              onKeyUp={handleEditFieldKeyUp}
            />
          </form>
        )
        : (
          <>
            <span
              data-cy="TodoTitle"
              className="todo__title"
              onDoubleClick={handleTitleChange(task.id)}
            >
              {task.title}
            </span>

            <button
              type="button"
              className="todo__remove"
              data-cy="TodoDelete"
              onClick={() => handleDeleteClick(task.id)}
            >
              ×
            </button>
          </>
        )}

      <div
        data-cy="TodoLoader"
        className={classNames('modal overlay', {
          'is-active': deletingTask.includes(task.id)
          || togglingId.includes(task.id)
          || (isAddingTask && isEdited === task.id),
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
