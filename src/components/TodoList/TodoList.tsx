import { Todo } from '../../types/Todo';
import { UpdateTodo } from '../../types/UpdateTodo';
import { TodoItem } from '../TodoItem';

interface Props {
  todos: Todo[];
  tempTodo: Todo | null;
  loadingItemIds: number[];
  handleDelete: (todoId: number) => void;
  handleUpdate: (
    todo: Todo,
    updateType: UpdateTodo,
    title?: string,
  ) => Promise<void>;
  editingTodoId: number | null;
  setEditingTodoId: (id: number | null) => void;
}

export const TodoList: React.FC<Props> = ({
  todos,
  tempTodo,
  loadingItemIds,
  handleDelete,
  handleUpdate,
  editingTodoId,
  setEditingTodoId,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => (
        <TodoItem
          todo={todo}
          isLoading={loadingItemIds.includes(todo.id)}
          handleDelete={handleDelete}
          handleUpdate={handleUpdate}
          isBeingEdited={editingTodoId === todo.id}
          setEditingTodoId={setEditingTodoId}
          key={todo.id}
        />
      ))}

      {tempTodo && (
        <TodoItem
          todo={tempTodo}
          isLoading={loadingItemIds.includes(tempTodo.id)}
          handleDelete={handleDelete}
          handleUpdate={handleUpdate}
          isBeingEdited={editingTodoId === tempTodo.id}
          setEditingTodoId={setEditingTodoId}
          key={tempTodo.id}
        />
      )}
    </section>
  );
};
