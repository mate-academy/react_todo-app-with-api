import React, { FC } from 'react';
import { Todo } from '../types/Todo';
import { TodoItem } from './TodoItem';

type Props = {
  todos: Todo[]
  onDeleteTodo: (todoId: number) => Promise<any>
  tempTodo: Todo | null;
  deletingTodoIds: number[]
  updatingTodoIds: number[]
  updateTodo: (
    todoId: number,
    updateData: Partial<Pick<Todo, 'title' | 'completed'>>
  ) => Promise<void>
};

export const TodoList: FC<Props> = React.memo((props) => {
  const {
    todos, deletingTodoIds, tempTodo, onDeleteTodo, updateTodo, updatingTodoIds,
  } = props;

  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => (
        <TodoItem
          todo={todo}
          key={todo.id}
          onDeleteTodo={onDeleteTodo}
          shouldShowLoader={
            deletingTodoIds.includes(todo.id)
            || updatingTodoIds.includes(todo.id)
          }
          updateTodo={updateTodo}
        />
      ))}

      {tempTodo && (
        <TodoItem
          todo={tempTodo}
          onDeleteTodo={onDeleteTodo}
          shouldShowLoader={
            deletingTodoIds.includes(tempTodo.id)
            || updatingTodoIds.includes(tempTodo.id)
          }
          updateTodo={updateTodo}
        />
      )}
    </section>
  );
});
