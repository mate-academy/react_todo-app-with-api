import React, { useContext } from 'react';
import { Todo } from '../../../types/Todo';
import { TodoUpdateContext } from '../../ContextProviders/TodoProvider';

type Props = {
  todo: Todo,
  isModified: boolean,
};

export const TodoTitle: React.FC<Props> = React.memo(({ todo, isModified }) => {
  const { setTodoInputStatus, removeTodo } = useContext(TodoUpdateContext);
  const { id, title } = todo;

  return (
    <>
      <span
        data-cy="TodoTitle"
        className="todo__title"
        onClick={() => setTodoInputStatus(true, id, todo)}
        aria-hidden="true"
      >
        {title}
      </span>
      {!isModified && (
        <button
          type="button"
          className="todo__remove"
          data-cy="TodoDeleteButton"
          onClick={() => removeTodo(id)}
        >
          ×
        </button>
      )}
    </>
  );
});
