import React from 'react';
import { Todo } from '../../types/Todo';
import { TodoComponent } from '../TodoComponent';

type Props = {
  todos: Todo[],
  tempTodo: Todo | null,
  onDelete: (id: number) => void,
  loadingTodoIds: number[],
  onUpdateTodo: (id: number, todo: object) => void,
};

export const TodoList: React.FC<Props> = ({
  todos,
  tempTodo,
  onDelete,
  loadingTodoIds,
  onUpdateTodo,
}) => {
  return (
    <section className="todoapp__main">
      {todos.map((todo) => (
        <TodoComponent
          todo={todo}
          key={todo.id}
          isLoading={loadingTodoIds.includes(todo.id)}
          onDelete={onDelete}
          onUpdateTodo={onUpdateTodo}
        />
      ))}

      {tempTodo && (
        <TodoComponent
          todo={tempTodo}
          key={tempTodo.id}
          onDelete={onDelete}
          isLoading
          onUpdateTodo={onUpdateTodo}
        />
      )}
    </section>
  );
};
