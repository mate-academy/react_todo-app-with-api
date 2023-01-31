import React, { memo } from 'react';
import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem/TodoItem';

type Props = {
  todos: Todo[];
  tempTodo: Todo | null;
  onRemoveTodo: (todoId: number) => void;
  removingTodosIds: number[];
  updateTodo: (
    todoId: number,
    updateData: Partial<Pick<Todo, 'title' | 'completed'>>
  ) => Promise<void>;
  updatingTodoIds: number[];
};

export const TodoList: React.FC<Props> = memo((props) => {
  const {
    todos,
    tempTodo,
    onRemoveTodo,
    removingTodosIds,
    updateTodo,
    updatingTodoIds,
  } = props;

  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => (
        <TodoItem
          todo={todo}
          key={todo.id}
          onRemoveTodo={onRemoveTodo}
          isDeleting={removingTodosIds.includes(todo.id)
            || updatingTodoIds.includes(todo.id)}
          updateTodo={updateTodo}
        />
      ))}

      {tempTodo && (
        <TodoItem
          todo={tempTodo}
          onRemoveTodo={onRemoveTodo}
          isDeleting={removingTodosIds.includes(tempTodo.id)}
          updateTodo={updateTodo}
        />
      )}
    </section>
  );
});
