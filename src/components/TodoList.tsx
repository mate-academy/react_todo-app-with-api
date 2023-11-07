import { Todo } from '../types/Todo';
import { TodoItem } from './TodoItem';

type Props = {
  todos: Todo[],
  onUpdateTodos: (todo: Todo) => void,
  tempTodo: Todo | null,
  onDeleteTodo: (id: number) => void,
  deletedIds: number[],
  editedTodo: Todo | null,
  togglingAll: boolean,
  editing: boolean,
  onEditing: (todo: Todo | null) => void,
  onEditSubmit?: (
    id: number,
    event?: React.FormEvent<HTMLFormElement>,
  ) => void,
};

export const TodoList: React.FC<Props> = ({
  todos,
  onUpdateTodos,
  tempTodo,
  onDeleteTodo,
  deletedIds,
  editedTodo,
  togglingAll,
  editing,
  onEditing,
  onEditSubmit,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map((todo) => (
        <TodoItem
          todo={todo}
          key={todo.id}
          onUpdateTodos={onUpdateTodos}
          onDeleteTodo={onDeleteTodo}
          deletedIds={deletedIds}
          editedTodo={editedTodo}
          togglingAll={togglingAll}
          editing={editing}
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
