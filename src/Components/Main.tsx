import { Todo } from '../types/Todo';
import { TodoItem } from './TodoItem';

interface Props {
  filtredItems: Todo[];
  handleToggle: (id: number) => void;
  handleDelete: (id: number) => void;
  tempTodo: Todo | null;
  deletingTodoId: number[];
  loadingTodoId: number[];
  startEditing: (id: number | null, currentTitle: string) => void;
  saveTitle: (id: number) => void;
  editingTodoId: number | null;
  setEditingTitle: (args: string) => void;
  editingTitle: string;
}

export const Main: React.FC<Props> = ({
  filtredItems,
  handleToggle,
  handleDelete,
  deletingTodoId,
  tempTodo,
  loadingTodoId,
  startEditing,
  saveTitle,
  editingTodoId,
  setEditingTitle,
  editingTitle,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {filtredItems.map(todo => (
        <TodoItem
          key={todo.id}
          todo={todo}
          handleToggle={handleToggle}
          handleDelete={handleDelete}
          tempTodo={tempTodo?.id === todo.id}
          isDelete={deletingTodoId.includes(todo.id)}
          loadingTodoId={loadingTodoId.includes(todo.id)}
          startEditing={startEditing}
          saveTitle={saveTitle}
          editingTodoId={editingTodoId}
          setEditingTitle={setEditingTitle}
          editingTitle={editingTitle}
        />
      ))}
    </section>
  );
};
