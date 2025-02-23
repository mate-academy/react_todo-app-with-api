import { Todo } from '../../types/Todo';

type Props = {
  todo: Todo;
  handleDelete: (id: number) => void;
};

export const TodoBody: React.FC<Props> = ({ todo, handleDelete }) => {
  return (
    <>
      <span data-cy="TodoTitle" className="todo__title">
        {todo.title}
      </span>
      <button
        type="button"
        className="todo__remove"
        data-cy="TodoDelete"
        onClick={() => handleDelete(todo.id)}
      >
        ×
      </button>
    </>
  );
};
