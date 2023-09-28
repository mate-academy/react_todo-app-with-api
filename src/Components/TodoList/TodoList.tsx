import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem/TodoItem';

type Props = {
  todos: Todo[];
  onDelete: (todoId: number) => void;
  deletingIds: number[];
  onTodoRename?: (todo: Todo, newTodoTitle: string) => Promise<void>,
  onRenameMessage: (err: string) => void;
  toggleTodo?: (todo: Todo) => Promise<void>;
};

export const TodoList: React.FC<Props> = ({
  todos,
  onDelete,
  deletingIds,
  onTodoRename = () => {},
  onRenameMessage,
  toggleTodo = () => {},
}) => {
  return (
    <section data-cy="TodoList" className="todoapp__main">
      {todos.map(todo => (
        <TodoItem
          key={todo.id}
          todo={todo}
          onDelete={() => onDelete(todo.id)}
          deletingIds={deletingIds}
          onTodoRename={(todoTitle) => onTodoRename(todo, todoTitle)}
          onRenameMessage={onRenameMessage}
          toggleTodo={() => toggleTodo(todo)}
        />
      ))}
    </section>
  );
};
