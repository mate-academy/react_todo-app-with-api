import { useTodo } from '../../../../context/TodoContext';
import { Todo } from '../../../../types/Todo';

type Props = {
  todo: Todo,
};

export const Loader = ({ todo }: Props) => {
  const {
    temptTodo,
    editedTodo,
  } = useTodo();

  const loaderCases
    = ((temptTodo && temptTodo.id === todo.id)
      || (editedTodo && todo.completed)
      || todo.hasLoader);

  return (
    <div
      data-cy="TodoLoader"
      className={loaderCases ? 'modal overlay is-active' : 'modal overlay'}
    >
      <div className="modal-background has-background-white-ter" />
      <div className="loader" />
    </div>

  );
};
