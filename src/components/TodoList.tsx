import { FC } from 'react';
import { MakeTodosCompleted, Todo } from '../types/Todo';
import { TodoItem } from './TodoItem';

type Props = {
  todos: Todo[];
  deleteTodo: (par: number) => Promise<void>;
  updateTodo: (par: Todo) => Promise<void>;
  searchCompletedTodos: () => void;
  makeTodosComplete: MakeTodosCompleted;
  clearCompleted: boolean;
  setClearCompleted: (par: boolean) => void;
  setMakeTodosComplete: (par: MakeTodosCompleted) => void;
};

export const TodoList: FC<Props> = ({
  todos,
  deleteTodo,
  updateTodo,
  searchCompletedTodos,
  makeTodosComplete,
  clearCompleted,
  setClearCompleted,
  setMakeTodosComplete,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map((todo) => (
        <TodoItem
          key={todo.id}
          updateTodo={updateTodo}
          deleteTodo={deleteTodo}
          todo={todo}
          searchCompletedTodos={searchCompletedTodos}
          makeTodosComplete={makeTodosComplete}
          clearCompleted={clearCompleted}
          setClearCompleted={setClearCompleted}
          setMakeTodosComplete={setMakeTodosComplete}
        />
      ))}
    </section>
  );
};
