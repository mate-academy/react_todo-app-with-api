import React from 'react';
import { Todo } from '../../types/Todo';
import { TodoInfo } from '../TodoInfo/TodoInfo';

type Props = {
  todos: Todo[],
  onTodoRemove: (todoId: number) => Promise<void>,
  loadingTodoId: number[],
  onTodoStatusChange: (updatedTodo: Todo) => Promise<void>,
  onTodoTitleChange: (
    todo: Todo,
    newTitle: string,
  ) => Promise<void>,
};

export const TodoList: React.FC<Props> = ({
  todos,
  onTodoRemove,
  loadingTodoId,
  onTodoStatusChange,
  onTodoTitleChange,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => (
        <TodoInfo
          todo={todo}
          key={todo.id}
          onRemove={async () => onTodoRemove(todo.id)}
          isLoading={loadingTodoId.includes(todo.id)}
          onStatusChange={async () => onTodoStatusChange(todo)}
          onTitleChange={onTodoTitleChange}
        />
      ))}
    </section>
  );
};
