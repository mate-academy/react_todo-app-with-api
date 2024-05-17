/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem/TodoItem';

type Props = {
  todos: Todo[];
  onDelete: (id: number) => void;
  toggleById: (todo: Todo, newIsCompleted: boolean) => void;
  onUpdate: (todo: Todo, newTitle: string) => void;
  beingEdited: number[];
  beingUpdated: number | null;
};

export const Todos: React.FC<Props> = ({
  todos,
  onDelete,
  toggleById,
  onUpdate,
  beingEdited,
  beingUpdated,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => (
        <TodoItem
          todo={todo}
          onDelete={onDelete}
          key={todo.id}
          toggleById={toggleById}
          onUpdate={onUpdate}
          beingEdited={beingEdited.includes(todo.id)}
          beingUpdated={beingUpdated}
        />
      ))}
    </section>
  );
};
