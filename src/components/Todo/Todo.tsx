import classNames from 'classnames';
import { useEffect, useState, useMemo } from 'react';
import { Filter } from '../../types/Filter';
import { Todo } from '../../types/Todo';
import TodoTitleField from '../TodoTitleField/TodoTitleFiled';

type Props = {
  todo: Todo;
  onDeleteTodo: (todoId: number) => void;
  deletingCompleted: boolean;
  onToggleStatus: () => void;
  isChanging: boolean;
  currentlyChanging: Filter;
  onTitleChange: (todo: Todo, value: string) => void;
};

const TodoComponent: React.FC<Props> = ({
  todo,
  onDeleteTodo,
  deletingCompleted,
  onToggleStatus,
  isChanging,
  currentlyChanging,
  onTitleChange,
}) => {
  const [hasSpinner, setHasSpinner] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const activeBecauseDeletingCompleted = todo.completed && deletingCompleted;
  const isActive = useMemo(
    () => {
      let isActiveTemp = activeBecauseDeletingCompleted || hasSpinner;

      if (currentlyChanging) {
        if (todo.completed && currentlyChanging === Filter.COMPLETED) {
          isActiveTemp = true;
        }

        if (!todo.completed && currentlyChanging === Filter.ACTIVE) {
          isActiveTemp = true;
        }
      }

      return isActiveTemp;
    }, [
      activeBecauseDeletingCompleted, hasSpinner,
    ],
  );

  useEffect(() => {
    if (!isChanging) {
      setHasSpinner(false);
    }
  }, [isChanging]);

  const deleteHandler = (todoId:number) => {
    onDeleteTodo(todoId);
    setHasSpinner(true);
  };

  const toggleHandler = () => {
    setHasSpinner(true);
    onToggleStatus();
  };

  const showEditForm = () => {
    setIsEditing(true);
  };

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      setIsEditing(false);
    }
  });

  const titleChangeHandler = (value: string) => {
    setIsEditing(false);
    setHasSpinner(true);

    if (todo.title === value) {
      return;
    }

    if (value.trim().length === 0) {
      onDeleteTodo(todo.id);
      setHasSpinner(true);

      return;
    }

    onTitleChange(todo, value);
  };

  const titleAndButton = (
    <>
      <span
        data-cy="TodoTitle"
        className="todo__title"
        onDoubleClick={showEditForm}
      >
        {todo.title}
      </span>
      <button
        type="button"
        className="todo__remove"
        data-cy="TodoDeleteButton"
        onClick={() => deleteHandler(todo.id)}
      >
        ×
      </button>
    </>
  );

  const editingField = (
    <TodoTitleField
      currentTitle={todo.title}
      onTitleChange={titleChangeHandler}
    />
  );

  return (
    <div
      data-cy="Todo"
      className={classNames('todo', {
        completed: todo.completed,
      })}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          defaultChecked={todo.completed}
          onChange={toggleHandler}
        />
      </label>
      {isEditing ? editingField : titleAndButton}
      <div
        data-cy="TodoLoader"
        className={classNames('modal overlay', { 'is-active': isActive })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};

export default TodoComponent;
