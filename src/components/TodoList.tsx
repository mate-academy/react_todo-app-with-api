import { Todo } from '../types/Todo';
import { TodoItem } from './TodoItem';

type PropsList = {
  todos: Todo[];
  onDelete: (todoId: number) => void;
  selectedIds: number[];
  onToggle: (updatedTodo: Todo) => void;
  handleEditing: (todoId: number) => void;
  handleSave: (todoId: number, newTitle: string) => void;
  editingId: number | null;
  editingTitle: string;
  setEditingId: React.Dispatch<React.SetStateAction<number | null>>;
  setEditingTitle: React.Dispatch<React.SetStateAction<string>>;
};

export const TodoList: React.FC<PropsList> = ({
  todos,
  onDelete,
  selectedIds,
  onToggle,
  handleEditing,
  handleSave,
  editingId,
  editingTitle,
  setEditingId,
  setEditingTitle,
}) => (
  <section className="todoapp__main" data-cy="TodoList">
    {todos.map((todo: Todo) => {
      return (
        <TodoItem
          key={todo.id}
          todo={todo}
          onDelete={onDelete}
          selectedIds={selectedIds}
          onToggle={onToggle}
          handleEditing={handleEditing}
          handleSave={handleSave}
          editingId={editingId}
          editingTitle={editingTitle}
          setEditingId={setEditingId}
          setEditingTitle={setEditingTitle}
        ></TodoItem>
      );
    })}
  </section>
);
