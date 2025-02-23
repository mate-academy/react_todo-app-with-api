import React from 'react';
import { Todo } from '../../types/todo';
import { TodoItem } from '../TodoItem';
import { TempTodo } from '../TempTodo';

type Props = {
  todos: Todo[];
  tempTodo: Todo | null;
  onDelete: (id: number) => void;
  loadingTodoIds: Set<number>;
  changeTodo: (todo: Todo) => void;
};

export const TodoList: React.FC<Props> = ({
  todos,
  tempTodo,
  onDelete,
  loadingTodoIds,
  changeTodo,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => (
        <TodoItem
          key={todo.id}
          todo={todo}
          onDelete={onDelete}
          isLoadingTodos={loadingTodoIds.has(todo.id)}
          changeTodo={changeTodo}
        />
      ))}

      {tempTodo && <TempTodo tempTodo={tempTodo} />}
    </section>
  );
};
