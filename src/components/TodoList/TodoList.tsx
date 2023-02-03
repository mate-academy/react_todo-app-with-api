import { memo } from 'react';
import { Todo } from '../../types/Todo';
import { TodoInfo } from '../TodoInfo/TodoInfo';

interface Props {
  newTodoField: React.RefObject<HTMLInputElement>,
  todos: Todo[],
  deleteTodo: (todoId: number) => void,
  tempTodo: Todo | null,
  isNewTodoLoading: boolean,
  updatingTodosIds: number[],
  updateTodo: (
    todoId: number,
    updateData: Partial<Pick<Todo, 'title' | 'completed'>>
  ) => void,
}

export const TodoList: React.FC<Props> = memo(({
  newTodoField,
  todos,
  deleteTodo,
  tempTodo,
  isNewTodoLoading,
  updatingTodosIds,
  updateTodo,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => (
        <TodoInfo
          newTodoField={newTodoField}
          todo={todo}
          deleteTodo={deleteTodo}
          key={todo.id}
          isUpdating={updatingTodosIds.includes(todo.id)}
          updateTodo={updateTodo}
        />
      ))}

      {tempTodo && (
        <TodoInfo
          newTodoField={newTodoField}
          todo={tempTodo}
          deleteTodo={deleteTodo}
          key={tempTodo?.id}
          isNewTodoLoading={isNewTodoLoading}
          updateTodo={updateTodo}
        />
      )}
    </section>
  );
});
