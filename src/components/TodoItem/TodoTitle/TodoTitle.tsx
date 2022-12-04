import React from 'react';
import { Todo } from '../../../types/Todo';

type Props = {
  todo: Todo;
  onIsEditing: (isEditing: boolean) => void;
  handleDeleteTodo?: () => void;
};

export const TodoTitle: React.FC<Props> = React.memo(({
  todo,
  onIsEditing,
  handleDeleteTodo = () => {},
}) => {
  const { title } = todo;

  return (
    <>
      <span
        data-cy="TodoTitle"
        className="todo__title"
        onDoubleClick={() => onIsEditing(true)}
      >
        {title}
      </span>
      <button
        type="button"
        className="todo__remove"
        data-cy="TodoDeleteButton"
        onClick={handleDeleteTodo}
      >
        ×
      </button>
    </>
  );
});
