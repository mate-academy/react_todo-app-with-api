import { Todo } from '../api/types/Todo';
import { TodoItem } from './TodoItem';

type Props = {
  todos: Todo[];
  deletingIds: number[];
  loadingIds: number[];
  editingTodoId: number | null;
  onStartEditing: (id: number) => void;
  onDelete: (id: number) => void;
  onToggle: (id: number) => void;
  onCancelEditing: () => void;
  onRename: (id: number, title: string) => void;
};

export const TodoList: React.FC<Props> = ({
  todos,
  deletingIds,
  loadingIds,
  editingTodoId,
  onStartEditing,
  onRename,
  onCancelEditing,
  onDelete,
  onToggle,
}) => {
  return (
    <>
      {todos.map(todo => (
        <TodoItem
          key={todo.id}
          todo={todo}
          isDeleting={deletingIds.includes(todo.id)}
          isLoading={loadingIds.includes(todo.id)}
          onDelete={onDelete}
          onToggle={onToggle}
          onRename={onRename}
          isEditing={editingTodoId === todo.id}
          onStartEditing={() => onStartEditing(todo.id)}
          onCancelEditing={onCancelEditing}
        />
      ))}
    </>
  );
};
