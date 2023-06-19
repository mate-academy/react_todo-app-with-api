import React, { memo } from 'react';
import { Todo } from '../../types/Todo';
import { TodoInfo } from '../TodoInfo/TodoInfo';

interface TodoListProps {
  todos: Todo[]
  tempTodo: Todo | null,
  onDeleteTodo: (todoId: number) => Promise<void>,
  delitingTodoIds: number[],
  updateTodo: (
    todoId: number,
    updateData: Partial<Pick<Todo, 'title' | 'completed'>>,
  ) => Promise<void>,
  updatingTodoIds: number[],
}

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
      <TodoInfo
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
      <TodoInfo
        todo={tempTodo}
        onDeleteTodo={onDeleteTodo}
        shouldShowLoader={delitingTodoIds.includes(tempTodo.id)}
        updateTodo={updateTodo}
      />
    )}
  </section>
));
