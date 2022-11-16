import { Todo } from '../../types/Todo';
import { TodoInfo } from './TodoInfo';

type Props = {
  todos: Todo[];
  tempTodo: Todo;
  isAdding: boolean;
  deleteTodo: (todoId: number) => void;
  todosIdsForDelete: number[];
  updateTodo: (todoId: number, data: Partial<Todo>) => void;
  todosIdsForUpdate: number[];
};

export const TodoList: React.FC<Props> = ({
  todos,
  tempTodo,
  isAdding,
  deleteTodo,
  todosIdsForDelete,
  updateTodo,
  todosIdsForUpdate,
}) => (
  <section className="todoapp__main" data-cy="TodoList">
    {
      todos.map(todo => (
        <TodoInfo
          todo={todo}
          key={todo.id}
          deleteTodo={deleteTodo}
          isDeleting={todosIdsForDelete.includes(todo.id)}
          updateTodo={updateTodo}
          isUpdating={todosIdsForUpdate.includes(todo.id)}
        />
      ))
    }

    {isAdding && tempTodo && (
      <TodoInfo
        todo={tempTodo}
        isAdding={isAdding}
      />
    )}
  </section>
);
