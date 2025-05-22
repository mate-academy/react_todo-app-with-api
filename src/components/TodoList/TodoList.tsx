import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem/TodoItem';

type Props = {
  todos: Todo[];
  todosDeleting: Todo['id'][];
  handleDeleteTodo: (todoId: Todo['id']) => Promise<boolean>;
  todosUpdating: Todo['id'][];
  handleUpdateTodo: (
    todoId: Todo['id'],
    updatedFields: Partial<Pick<Todo, 'title' | 'completed'>>,
  ) => Promise<boolean>;
};

export const TodoList: React.FC<Props> = ({
  todos,
  todosDeleting,
  handleDeleteTodo,
  todosUpdating,
  handleUpdateTodo,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => (
        <TodoItem
          key={todo.id}
          todo={todo}
          isLoading={
            todosDeleting.includes(todo.id) || todosUpdating.includes(todo.id)
          }
          handleDelete={handleDeleteTodo}
          handleUpdate={handleUpdateTodo}
        />
      ))}
    </section>
  );
};