import { FC, memo } from 'react';
import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem/TodoItem';

export interface TodoListProps {
  todos: Todo[],
  onDeleteTodo: (todoId: number) => void;
  tempTodo: Todo | null,
  onDeletingTodoIds: number[],
  updateTodo:(
    todoId: number,
    fieldsToUpdate: Partial<Pick<Todo, 'title' | 'completed'>>
  ) => Promise<void>,
  onUpdatingTodosIds: number[],
}

export const TodoList: FC<TodoListProps> = memo(({
  todos,
  onDeleteTodo,
  tempTodo,
  onDeletingTodoIds,
  updateTodo,
  onUpdatingTodosIds,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => (
        <TodoItem
          key={todo.id}
          todo={todo}
          onDeleteTodo={onDeleteTodo}
          isDeleting={onDeletingTodoIds.includes(todo.id)}
          updateTodo={updateTodo}
          isUpdating={onUpdatingTodosIds.includes(todo.id)}

        />
      ))}
      {tempTodo && (
        <TodoItem
          todo={tempTodo}
          onDeleteTodo={onDeleteTodo}
          isDeleting={onDeletingTodoIds.includes(tempTodo.id)}
          updateTodo={updateTodo}
          isUpdating={onUpdatingTodosIds.includes(tempTodo.id)}
        />
      )}
    </section>
  );
});
