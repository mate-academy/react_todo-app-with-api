import { Todo } from '../../types/Todo';
import { TodoItem } from '../Todo/TodoItem';

type Props = {
  todos: Todo[],
  onDelete: (todoId: number) => void,
  deletingDataIds: number[],
  onUpdate: (chosenTodo: Todo) => void,
  updatingDataTodos: Todo[],
};

export const TodoList: React.FC<Props> = ({
  todos,
  onDelete,
  deletingDataIds,
  onUpdate,
  updatingDataTodos,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">

      {todos.map(todo => {
        const condition = updatingDataTodos
          .find(data => todo.id === data.id) || false;

        return (
          <TodoItem
            todo={todo}
            key={todo.id}
            isDeleting={deletingDataIds.includes(todo.id)}
            onDelete={onDelete}
            onUpdate={onUpdate}
            isUpdating={condition}
          />
        );
      })}
    </section>
  );
};
