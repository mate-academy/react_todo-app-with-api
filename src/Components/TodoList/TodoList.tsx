import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem';

type Props = {
  todos: Todo[];
  tempTodoTitle: string | null;
  loadingIds: number[];
  onDelete: (id: number) => void;
  onToggle: (id: number) => void;
  onEdit: (id: number, NewTitle: string) => void;
};

export const TodoList: React.FC<Props> = ({
  todos,
  tempTodoTitle,
  loadingIds,
  onDelete,
  onToggle,
  onEdit,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => {
        return (
          <TodoItem
            key={todo.id}
            todo={todo}
            loadingIds={loadingIds}
            onDelete={onDelete}
            onToggle={onToggle}
            onEdit={onEdit}
          />
        );
      })}

      {tempTodoTitle && (
        <TodoItem
          todo={{ id: 0, userId: 0, title: tempTodoTitle, completed: false }}
          loadingIds={[0]}
        />
      )}
    </section>
  );
};
