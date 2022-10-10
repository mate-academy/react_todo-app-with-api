import { Todo } from '../types/Todo';
import { TodoItem } from './TodoItem';

type Props = {
  filterTodos: Todo[] | [],
  tempTodo: Todo,
  removeTodo: (id: number) => Promise<void>,
  isDeleting: boolean,
  onUpdateTodo: (todo: Todo) => Promise<void>;
  isUpdating: boolean,
};

export const TodoList: React.FC<Props> = ({
  filterTodos,
  tempTodo,
  removeTodo,
  isDeleting,
  onUpdateTodo,
  isUpdating,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">

      {filterTodos.map((todo) => {
        return (
          <TodoItem
            todo={todo}
            key={todo.id}
            removeTodo={removeTodo}
            isDeleting={isDeleting}
            onUpdateTodo={onUpdateTodo}
            isUpdating={isUpdating}
          />
        );
      })}

      {
        tempTodo.title.length !== 0 && (
          <TodoItem
            todo={tempTodo}
            key={tempTodo.id}
            removeTodo={removeTodo}
            isDeleting={isDeleting}
            onUpdateTodo={onUpdateTodo}
            isUpdating={isUpdating}
          />
        )
      }
    </section>
  );
};
