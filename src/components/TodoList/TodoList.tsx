import React, { memo } from 'react';
import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem/TodoItem';

interface Props {
  todos: Todo[],
  tempTodo: Todo | null,
  onDeleteTodo: (todoId: number) => Promise<void>,
  deletingTodoIds: number[],
  onUpdateTodo: (
    todoId: number,
    updateData: Partial<Pick<Todo, 'title' | 'completed'>>,
  ) => Promise<void>,
}

export const TodoList: React.FC<Props> = memo((props) => {
  const {
    todos,
    tempTodo,
    onDeleteTodo,
    deletingTodoIds,
    onUpdateTodo,
  } = props;

  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => (
        <TodoItem
          todo={todo}
          key={todo.id}
          onDeleteTodo={onDeleteTodo}
          shouldLoadOnDelete={deletingTodoIds.includes(todo.id)}
          onUpdateTodo={onUpdateTodo}
        />
      ))}

      {tempTodo && (
        <TodoItem
          todo={tempTodo}
          onDeleteTodo={onDeleteTodo}
          onUpdateTodo={onUpdateTodo}
        />
      )}
    </section>
  );
});
