import React from 'react';
import { Todo } from '../../types/Todo';
import { UpdateTodoArgs } from '../../types/UpdateTodoArgs';
import { TodoInfo } from '../todoInfo';

type Props = {
  todos: Todo[];
  tempTodo: Todo | null;
  loadingTodos: number[];
  setLoadingTodos: React.Dispatch<React.SetStateAction<number[] | []>>;
  deleteTodo: (todoId: number) => void;
  toggleTodo: (todoId: number, data: UpdateTodoArgs) => void;
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>;
  setError: React.Dispatch<React.SetStateAction<string | null>>;
};

export const TodoList: React.FC<Props> = ({
  todos,
  tempTodo,
  loadingTodos,
  setLoadingTodos,
  deleteTodo,
  toggleTodo,
  setTodos,
  setError,
}) => {
  return (
    <section className="todoapp__main">
      {todos.map(todo => (
        <TodoInfo
          key={todo.id}
          todo={todo}
          todos={todos}
          loadingTodos={loadingTodos}
          setLoadingTodos={setLoadingTodos}
          deleteTodo={deleteTodo}
          toggleTodo={toggleTodo}
          setTodos={setTodos}
          setError={setError}
        />
      ))}

      {tempTodo && (
        <TodoInfo
          todo={tempTodo}
          todos={todos}
          loadingTodos={loadingTodos}
          setLoadingTodos={setLoadingTodos}
          deleteTodo={deleteTodo}
          toggleTodo={toggleTodo}
          setTodos={setTodos}
          setError={setError}
        />
      )}
    </section>
  );
};
