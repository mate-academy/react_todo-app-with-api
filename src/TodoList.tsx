import React from 'react';
import { TodoItem } from './TodoItem';
import { Todo } from './types/Todo';

type Props = {
  filteredTodos: Todo[];
  tempTodo: Todo | null;
  todos: Todo[];
  setTodos: (todo: Todo[]) => void;
  userId: number;
  clearCompleted: boolean;
  setErrorMessage: (error: string) => void;
  loadingAll:boolean;
};

export const TodoList: React.FC<Props> = ({
  filteredTodos,
  tempTodo,
  todos,
  setTodos,
  userId,
  clearCompleted,
  setErrorMessage,
  loadingAll,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {filteredTodos.map((todo: Todo) => (
        <TodoItem
          todo={todo}
          key={todo.id}
          todos={todos}
          setTodos={setTodos}
          userId={userId}
          clearCompleted={clearCompleted}
          setErrorMessage={setErrorMessage}
          loadingAll={loadingAll}
        />
      ))}
      {tempTodo && (
        <TodoItem
          todo={tempTodo}
          todos={todos}
          setTodos={setTodos}
          userId={userId}
          clearCompleted={clearCompleted}
          setErrorMessage={setErrorMessage}
          loadingAll={loadingAll}
        />
      )}
    </section>
  );
};
