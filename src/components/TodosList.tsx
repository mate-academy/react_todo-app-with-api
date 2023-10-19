import { Todo } from '../types/Todo';
import { TodoInfo } from './TodoInfo';

type TodosListProps = {
  todos: Todo[]
  onClickRemove: (todoId: number) => void
  loadingTodosIds: number[]
  onClickLabel: (todoId: number) => void
  onDoubleClick: (todoId: number, event: React.MouseEvent) => void
  doubleClickedTodoId: number
  onSubmit: (todoId: number, title: string) => void
};

export const TodosList = ({
  todos,
  onClickRemove,
  onClickLabel,
  loadingTodosIds,
  onDoubleClick,
  doubleClickedTodoId,
  onSubmit,
}: TodosListProps) => (
  <section className="todoapp__main">
    {todos.map(todo => (
      <TodoInfo
        key={todo.id}
        todo={todo}
        onClickRemove={onClickRemove}
        onClickLabel={onClickLabel}
        loadingTodosIds={loadingTodosIds}
        onDoubleClick={onDoubleClick}
        doubleClickedTodoId={doubleClickedTodoId}
        onSubmit={onSubmit}
      />
    ))}
  </section>
);
