import { Todo } from '../types/Todo';
import { TodoCard } from './Todo';

type Props = {
  todos: Todo[];
  onDelete: (id: number) => void;
  onToggle: (id: number) => void;
  setEditingTodoId: (id: number | null) => void;
  processingIds: number[];
  editingTodoId?: number | null;
  onUpdate: (id: number, title: string) => void;
};

export const TodoList = ({
  todos,
  onDelete,
  onToggle,
  processingIds,
  setEditingTodoId,
  editingTodoId,
  onUpdate,
}: Props) => {
  return (
    <>
      {todos.map((todo: Todo) => (
        <TodoCard
          key={todo.id}
          todo={todo}
          onDelete={onDelete}
          isProcessed={processingIds.includes(todo.id)}
          setEditingTodoId={setEditingTodoId}
          onToggle={onToggle}
          editingTodoId={editingTodoId}
          onUpdate={onUpdate}
        />
      ))}
    </>
  );
};
