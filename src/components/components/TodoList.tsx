import { FC, memo } from 'react';
import { Todo } from '../../types/Todo';
import { TodoItem } from './TodoItem';

type Props = {
  todos: Todo[]
  handleDeleteTodo: (id: number) => void
  deletingTodosIds: number[]
  tempTodo: Todo | null
  updateTodo: (
    todoId: number,
    newData: Partial<Pick<Todo, 'title' | 'completed'>>,
  ) => Promise<void>,
  updatingTodoIds: number[],
};

export const TodoList: FC<Props> = memo(({
  todos,
  handleDeleteTodo,
  deletingTodosIds,
  tempTodo,
  updateTodo,
  updatingTodoIds,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => (
        <TodoItem
          key={todo.id}
          todo={todo}
          handleDeleteTodo={handleDeleteTodo}
          isDelete={deletingTodosIds.includes(todo.id)}
          updateTodo={updateTodo}
          updatingTodoIds={updatingTodoIds}
        />
      ))}

      {tempTodo && (
        <TodoItem
          todo={tempTodo}
          updateTodo={updateTodo}
          updatingTodoIds={[]}
        />
      )}
    </section>
  );
});
