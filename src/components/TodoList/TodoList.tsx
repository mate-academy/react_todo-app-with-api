import React, { memo } from 'react';
import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem/TodoItem';

type TodoListProps = {
  todos: Todo[]
  tempTodo: Todo | null,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onDeleteTodo: (todoId: number) => Promise<any>,
  delitingTodoIds: number[],
  updateTodo: (
    todoId: number,
    updateData: Partial<Pick<Todo, 'title' | 'completed'>>,
  ) => Promise<void>,
  updatingTodoIds: number[],
};

export const TodoList: React.FC<TodoListProps> = memo(({
  todos,
  tempTodo,
  onDeleteTodo,
  delitingTodoIds,
  updateTodo,
  updatingTodoIds,
}) => (
  <section className="todoapp__main" data-cy="TodoList">
    {todos.map(todo => (
      <TodoItem
        todo={todo}
        key={todo.id}
        onDeleteTodo={onDeleteTodo}
        shouldShowLoader={
          delitingTodoIds.includes(todo.id) || updatingTodoIds.includes(todo.id)
        }
        updateTodo={updateTodo}
      />
    ))}

    {tempTodo && (
      <TodoItem
        todo={tempTodo}
        onDeleteTodo={onDeleteTodo}
        shouldShowLoader={delitingTodoIds.includes(tempTodo.id)}
        updateTodo={updateTodo}
      />
    )}
  </section>
));
