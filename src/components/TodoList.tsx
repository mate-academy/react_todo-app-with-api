import { FC } from 'react';
import { Todo } from '../types/Todo';
import { TodoItem } from './TodoItem';

interface Props {
  todos: Todo[];
  tempTodo: Todo | null;
  removeTodoByID: (arg: number) => void;
  editTodoByID: (id: number, data: Partial<Todo>) => Promise<boolean>;
  currentlyLoadingTodos: number[];
}

export const TodoList:FC<Props> = ({
  todos,
  tempTodo,
  removeTodoByID,
  editTodoByID,
  currentlyLoadingTodos,
}) => {
  return (
    <section className="todoapp__main">
      {todos.map(todo => {
        const isLoadingNow = currentlyLoadingTodos.includes(todo.id);

        return (
          <TodoItem
            key={todo.id}
            todo={todo}
            removeTodoByID={removeTodoByID}
            editTodoByID={editTodoByID}
            isLoadingNow={isLoadingNow}
          />
        );
      })}
      {tempTodo && (
        <TodoItem
          todo={tempTodo}
          removeTodoByID={removeTodoByID}
          editTodoByID={editTodoByID}
          isLoadingNow
        />
      )}
    </section>
  );
};
