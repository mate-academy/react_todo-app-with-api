import { useTodo } from '../../../context/TodoContext';
import { Todo } from '../../../types/Todo';
import { EditInput } from './EditInput';
import { Loader } from './Loader';
import { RemoveTaskButton } from './RemoveTaskButton';
import { ToggleInput } from './ToggleInput';

type Props = {
  todo: Todo;
};

export const Task = ({ todo }: Props) => {
  const {
    todos,
    onTitleEdition,
  } = useTodo();

  return (
    <div
      className={
        todo.completed ? 'todo completed' : 'todo'
      }
      onDoubleClick={() => onTitleEdition(todos, todo.id)}
      data-cy="Todo"
    >
      <ToggleInput todo={todo} />
      {todo.isOnTitleEdition
        ? (
          <EditInput todo={todo} />
        ) : (
          <>
            <span
              data-cy="TodoTitle"
              className="todo__title"
            >
              {todo.title}
            </span>
            <RemoveTaskButton todo={todo} />
          </>
        )}

      <Loader todo={todo} />
    </div>
  );
};
