import { FC } from 'react';
import { Todo } from '../types/Todo';
import { TodoItem } from './TodoItem';

interface Props {
  todos: Todo[];
  tempTodo: Todo | null;
  removeTodoByID: (arg: number) => void;
  editTodoByID: (id: number, data: Partial<Todo>) => Promise<boolean>;
  loadingTodos: number[];
}

export const TodoList:FC<Props> = ({
  todos,
  tempTodo,
  removeTodoByID,
  editTodoByID,
  loadingTodos,
}) => {
  return (
    <section className="todoapp__main">
      {todos.map(todo => {
        const isPresentInLoadingTodos = loadingTodos.includes(todo.id);

        return (
          <TodoItem
            key={todo.id}
            todo={todo}
            removeTodoByID={removeTodoByID}
            editTodoByID={editTodoByID}
            isPresentInLoadingTodos={isPresentInLoadingTodos}
          />
        );
      })}
      {tempTodo && (
        <TodoItem
          todo={tempTodo}
          isPresentInLoadingTodos
        />
      )}
    </section>
  );
};
