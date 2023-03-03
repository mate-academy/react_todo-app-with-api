import { memo } from 'react';
import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem/TodoItem';

interface TodoListProps {
  isUpdatingTodo: boolean;
  todos: Todo[];
  tempTodo: Todo | null;
  deleteTodo: (todoId: number) => Promise<unknown>
  delitingTodoIds: number[];
  updateTodo: (
    todoId: number,
    fieldsToUpdate: Partial<Pick<Todo, 'title' | 'completed'>>,
  ) => Promise<void>;
  updatingTodoIds: number[];
}

export const TodoList: React.FC<TodoListProps> = memo(({
  todos,
  tempTodo,
  deleteTodo,
  delitingTodoIds,
  updateTodo,
  updatingTodoIds,
  isUpdatingTodo,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => (
        <TodoItem
          todo={todo}
          key={todo.id}
          deleteTodo={deleteTodo}
          shouldShowLoader={delitingTodoIds.includes(todo.id)
              || updatingTodoIds.includes(todo.id)}
          updateTodo={updateTodo}
          isUpdatingTodo={isUpdatingTodo}
        />
      ))}

      {tempTodo && (
        <TodoItem
          todo={tempTodo}
          deleteTodo={deleteTodo}
          shouldShowLoader={delitingTodoIds.includes(tempTodo.id)
            || updatingTodoIds.includes(tempTodo.id)}
          updateTodo={updateTodo}
          isUpdatingTodo={isUpdatingTodo}
        />
      )}
    </section>
  );
});
