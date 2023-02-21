import { FC, memo } from 'react';
import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem/TodoItem';

export interface TodoListProps {
  todos: Todo[],
  onDeleteTodo: (todoId: number) => void;
  tempTodo: Todo | null,
  deletingTodoIds: number[],
  updateTodo:(
    todoId: number,
    fieldsToUpdate: Partial<Pick<Todo, 'title' | 'completed'>>
  ) => Promise<void>,
  updatingTodosIds: number[],
}

export const TodoList: FC<TodoListProps> = memo(({
  todos,
  onDeleteTodo,
  tempTodo,
  deletingTodoIds,
  updateTodo,
  updatingTodosIds,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => (
        <TodoItem
          key={`${todo.id}`}
          todo={todo}
          onDeleteTodo={onDeleteTodo}
          isDeleting={deletingTodoIds.includes(todo.id)}
          onUpdateTodo={updateTodo}
          isUpdating={updatingTodosIds.includes(todo.id)}

        />
      ))}
      {tempTodo && (
        <TodoItem
          todo={tempTodo}
          onDeleteTodo={onDeleteTodo}
          isDeleting={deletingTodoIds.includes(tempTodo.id)}
          onUpdateTodo={updateTodo}
          isUpdating={updatingTodosIds.includes(tempTodo.id)}
        />
      )}
    </section>
  );
});
