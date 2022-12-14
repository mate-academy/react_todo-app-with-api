import { Todo } from '../../types/Todo';
import { ActualTodo } from '../ActualTodo/ActualTodo';

interface Props {
  todos: Todo[],
  onDelete: (todoId: number) => void,
  onUpdate: (todoId: number, dataToUpdate: Partial<Todo>,) => void,
}

export const TodoList: React.FC<Props> = ({
  todos,
  onDelete,
  onUpdate,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => (
        <ActualTodo
          key={todo.id}
          todo={todo}
          onDelete={onDelete}
          onUpdate={onUpdate}
        />
      ))}
    </section>
  );
};
