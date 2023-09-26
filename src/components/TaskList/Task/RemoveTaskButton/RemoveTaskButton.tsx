import { useTodo } from '../../../../provider/todoProvider';
import { Todo } from '../../../../types/Todo';

type Props = {
  todo: Todo,
};
export const RemoveTaskButton = ({ todo }: Props) => {
  const {
    removeTask,
  } = useTodo();

  return (
    <button
      data-cy="TodoDelete"
      type="button"
      className="todo__remove"
      onClick={() => removeTask(todo)}
    >
      ×

    </button>
  );
};
