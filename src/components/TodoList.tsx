import { FC } from 'react';
import { Todo } from '../types/Todo';
import { TodoItem } from './TodoItem';

interface Props {
  todos: Todo[];
  tempTodo: Todo | null;
  deleteTodoByID: (arg: number) => void
  editTodoByID: (id: number, data: Partial<Todo>) => Promise<boolean>
}

export const TodoList:FC<Props> = ({
  todos,
  tempTodo,
  deleteTodoByID,
  editTodoByID,
}) => {
  return (
    <section className="todoapp__main">
      {todos.map(todo => {
        return (
          <TodoItem
            key={todo.id}
            todo={todo}
            deleteTodoByID={deleteTodoByID}
            editTodoByID={editTodoByID}
          />
        );
      })}
      {tempTodo && (
        <TodoItem
          todo={tempTodo}
          deleteTodoByID={deleteTodoByID}
          editTodoByID={editTodoByID}
        />
      )}
    </section>
  );
};
