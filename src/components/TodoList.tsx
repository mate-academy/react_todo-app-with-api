import { Todo } from '../types/Todo';
import { TodoItem } from './TodoItem';

type Props = {
  todos: Todo[],
  onToggleTodos: (todo: Todo) => void,
  tempTodo: Todo | null,
  onDeleteTodo: (id: number) => void,
  deletedIds: number[],
  toggledTodo: Todo | null,
  editedTodo: Todo | null,
  togglingAll: boolean,
  isLoading: boolean,
  onEditing: (todo: Todo | null) => void,
  onEditSubmit?: (
    id: number,
    event?: React.FormEvent<HTMLFormElement>,
  ) => void,
};

export const TodoList: React.FC<Props> = ({
  todos,
  onToggleTodos,
  tempTodo,
  onDeleteTodo,
  deletedIds,
  toggledTodo,
  editedTodo,
  togglingAll,
  isLoading,
  onEditing,
  onEditSubmit,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map((todo) => (
        <TodoItem
          todo={todo}
          key={todo.id}
          onToggleTodos={onToggleTodos}
          onDeleteTodo={onDeleteTodo}
          toggledTodo={toggledTodo}
          deletedIds={deletedIds}
          editedTodo={editedTodo}
          togglingAll={togglingAll}
          isLoading={isLoading}
          onEditing={onEditing}
          onEditSubmit={onEditSubmit}
        />
      ))}
      {tempTodo && (
        <TodoItem todo={tempTodo} />
      )}
    </section>
  );
};
