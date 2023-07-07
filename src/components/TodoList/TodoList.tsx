import React from 'react';
import { TodoItem } from '../TodoItem/TodoItem';
import { Todo, UpdateTodoArgs } from '../../types/Todo';

interface Props {
  todos: Todo[];
  onDelete: CallableFunction;
  loadingTodoIds: number[];
  tempTodo: Todo | null,
  handleUpdateTodo: (
    todoId: number,
    newTodoData: UpdateTodoArgs,
  ) => void;
}

export const TodoList: React.FC<Props> = ({
  todos,
  onDelete,
  loadingTodoIds,
  tempTodo,
  handleUpdateTodo,
}) => (

  <section className="todoapp__main">
    {todos.map(todo => (
      <TodoItem
        key={todo.id}
        todo={todo}
        loadingTodoIds={loadingTodoIds}
        onDelete={onDelete}
        handleUpdateTodo={handleUpdateTodo}
      />
    ))}

    {tempTodo && (
      <TodoItem
        todo={tempTodo}
        loadingTodoIds={loadingTodoIds}
        onDelete={onDelete}
        handleUpdateTodo={handleUpdateTodo}
      />
    )}
  </section>
);
