import { TodoItem } from '../TodoItem/TodoItem';
import { Todo } from '../../types/Todo';

type Props = {
  todos: Todo[];
  isLoading?: boolean;
  editingId?: number | null;
  isAdding?: boolean;
  togglingId?: number | null;
  isTogglingAll?: boolean;
  deletingId?: number | null;
  renamingId?: number | null;
  onDelete: (id: number) => void;
  handleToggle: (id: number) => void;
  handleRename: (id: number, newTitle: string) => void;
  setEditingId: (id: number | null) => void;
};

export const TodoList: React.FC<Props> = ({
  todos,
  isAdding,
  editingId,
  deletingId,
  togglingId,
  isTogglingAll,
  renamingId,
  onDelete,
  handleToggle,
  handleRename,
  setEditingId,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => {
        return (
          <TodoItem
            key={todo.id}
            todo={todo}
            isLoading={isAdding && todo.id === 0}
            isEditing={editingId === todo.id}
            isDeleting={deletingId === todo.id}
            isToggling={togglingId === todo.id || isTogglingAll}
            isRenaming={renamingId === todo.id}
            onDelete={onDelete}
            handleToggle={handleToggle}
            handleRename={handleRename}
            setEditingId={setEditingId}
          />
        );
      })}
    </section>
  );
};
