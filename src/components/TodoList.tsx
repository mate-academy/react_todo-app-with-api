import { memo } from 'react';
import { Todo } from '../types/Todo';
import { TodoItem } from './TodoItem';

interface Props {
  todos: Todo[],
  tempTodo: Todo | null,
  deleteTodo: (id: number) => void,
  loadingTodoIds: number[],
  updateTodo: (id: number, data: Partial<Todo>) => void,
}

export const TodoList: React.FC<Props> = memo(({
  todos, tempTodo, deleteTodo, loadingTodoIds, updateTodo,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(({ title, completed, id }) => (
        <TodoItem
          title={title}
          completed={completed}
          id={id}
          key={id}
          deleteTodo={deleteTodo}
          isLoading={loadingTodoIds.includes(id)}
          updateTodo={updateTodo}
        />
      ))}
      {tempTodo && (
        <TodoItem
          title={tempTodo.title}
          completed={false}
          id={tempTodo.id}
          deleteTodo={deleteTodo}
          isLoading
          updateTodo={updateTodo}
        />
      )}
    </section>
  );
});
