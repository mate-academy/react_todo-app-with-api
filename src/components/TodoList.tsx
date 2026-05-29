import React from 'react';
import { TodoItem } from './TodoItem';
import { Todo } from '../types/Todo';
import { TempTodo } from './TempTodo';

type Props = {
  filteredTodos: Todo[];
  deleteTodo: (todoId: number) => Promise<void>;
  loadingTodoId: number | null;
  tempTodo: Todo | null;
  updateTodo: (updatedTodo: Todo) => Promise<Todo>;
};

export const TodoList: React.FC<Props> = ({
  filteredTodos,
  deleteTodo,
  loadingTodoId,
  tempTodo,
  updateTodo,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {filteredTodos.map(todo => (
        <TodoItem
          key={todo.id}
          todo={todo}
          deleteTodo={deleteTodo}
          loadingTodoId={loadingTodoId}
          updateTodo={updateTodo}
        />
      ))}

      {tempTodo && <TempTodo tempTodo={tempTodo} />}
    </section>
  );
};
