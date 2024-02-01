import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem/TodoItem';

type Props = {
  todos: Todo[];
  onDelete: (todoId: number) => void;
  todoTemp: Todo | null;
  onUpdate: (id: number, todo: Todo) => void;
  processingTodoIds: number[];
};

export const TodoList: React.FC<Props> = ({
  todos,
  onDelete,
  todoTemp,
  onUpdate,
  processingTodoIds,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => (
        <TodoItem
          todo={todo}
          key={todo.id}
          onDelete={onDelete}
          onUpdate={onUpdate}
          hasLoader={processingTodoIds}
        />
      ))}

      {todoTemp && (
        <TodoItem
          todo={todoTemp}
          key={todoTemp.id}
          onDelete={onDelete}
          onUpdate={onUpdate}
          hasLoader={processingTodoIds}
        />
      )}
    </section>
  );
};
