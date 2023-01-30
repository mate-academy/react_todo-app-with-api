import { memo } from 'react';
import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem/TodoItem';

interface Props {
  todos: Todo[],
  onDeleteTodo: (todoId: number) => Promise<any>;
  onChangeTodoStatus: (todoId: number, status: boolean) => void;
  tempTodo: Todo | null;
  deletingTodoIds: number[];
}

export const TodoList: React.FC<Props> = memo(({
  todos,
  onDeleteTodo,
  onChangeTodoStatus,
  tempTodo,
  deletingTodoIds,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map((todo => (
        <TodoItem
          todo={todo}
          key={todo.id}
          onDeleteTodo={onDeleteTodo}
          onChangeTodoStatus={onChangeTodoStatus}
          isDeleting={deletingTodoIds.includes(todo.id)}
        />
      )))}

      {tempTodo && (
        <TodoItem
          todo={tempTodo}
          onDeleteTodo={onDeleteTodo}
          onChangeTodoStatus={onChangeTodoStatus}
          isDeleting={deletingTodoIds.includes(tempTodo.id)}
        />
      )}
    </section>
  );
});
