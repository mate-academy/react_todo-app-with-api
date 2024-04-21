import { useContext } from 'react';
import { ContextTodos } from './TodoContext';
import { Todo } from './types/Todo';

type Props = {
  todo: Todo;
};

export const Title = ({ todo }: Props) => {
  const { setIsEdited, handleRemoveButton } = useContext(ContextTodos);

  return (
    <>
      <span
        data-cy="TodoTitle"
        onDoubleClick={() => setIsEdited(todo.id)}
        className="todo__title"
      >
        {todo.title}
      </span>
      <button
        onClick={event => handleRemoveButton(todo, event)}
        type="button"
        className="todo__remove"
        data-cy="TodoDelete"
      >
        ×
      </button>
    </>
  );
};
