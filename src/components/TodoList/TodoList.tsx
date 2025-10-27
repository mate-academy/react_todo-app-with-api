import { Todo } from '../../types/Todo';
import TodoItem from '../Todo/TodoItem';

/* eslint-disable jsx-a11y/label-has-associated-control */
type Props = {
  todos: Todo[];
  loadingIds: number[];
  tempTodo: Todo | null;
  onDelete: (todoId: number) => void;
  onUpdateCompleted: (todo: Todo) => void;
  onUpdateTitle: (todoId: number, title: string) => Promise<void>;
};
export default function TodoList({
  todos,
  loadingIds,
  tempTodo,
  onDelete,
  onUpdateCompleted,
  onUpdateTitle,
}: Props) {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => (
        <TodoItem
          key={todo.id}
          todo={todo}
          loading={loadingIds.includes(todo.id)}
          onDelete={onDelete}
          onUpdateCompleted={onUpdateCompleted}
          onUpdateTitle={onUpdateTitle}
        />
      ))}

      {/* This todo is in loadind state */}
      {tempTodo && <TodoItem todo={tempTodo} loading={true} />}
    </section>
  );
}
