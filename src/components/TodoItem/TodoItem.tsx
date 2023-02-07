import classNames from 'classnames';
import { useContext, useState } from 'react';
import { ActionStateContext } from '../../context/ActionStateContext';
import { Todo } from '../../types/Todo';
import { TodoEdit } from '../TodoEdit';

type Props = {
  todo: Todo,
  deleteTodo: (id: number) => void;
  updateTodo: (id: number, data: Partial<Todo>) => void,
};

export const TodoItem: React.FC<Props> = ({
  todo: { id, title, completed },
  deleteTodo,
  updateTodo,
}) => {
  const {
    isUpdating,
    selectedIdArr,
    isDeleting,
  } = useContext(ActionStateContext);
  const [isEditing, setIsEditing] = useState(false);
  const isInAction = (isUpdating || isDeleting) && selectedIdArr.includes(id);
  const isProcessing = id === 0 || isInAction;

  return (
    <div
      data-cy="Todo"
      className={classNames(
        'todo',
        { completed },
      )}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          defaultChecked
          onClick={() => updateTodo(id, { completed: !completed })}
        />
      </label>

      {!isEditing ? (
        <>
          <span
            data-cy="TodoTitle"
            className="todo__title"
            onDoubleClick={() => setIsEditing(true)}
          >
            {title}
          </span>
          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDeleteButton"
            onClick={() => deleteTodo(id)}
          >
            ×
          </button>
        </>
      ) : (
        <TodoEdit
          todoId={id}
          prevTitle={title}
          deleteTodo={deleteTodo}
          updateTodo={updateTodo}
          setIsEditing={setIsEditing}
        />
      )}

      <div
        data-cy="TodoLoader"
        className={classNames(
          'modal overlay',
          { 'is-active': isProcessing },
        )}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
