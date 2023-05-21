import { FC } from 'react';
import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem';

interface TodoListProps {
  todos: Todo[];
  onDeleteTodo: (todoId: number) => void;
  onUpdate: (todoId: number, isActive: Todo) => void;
}

export const TodoList: FC<TodoListProps> = ({
  todos,
  onDeleteTodo,
  onUpdate,
}) => (
  <section className="todoapp__main">
    {todos.map((todo) => (
      <TodoItem
        todo={todo}
        key={todo.id}
        onDeleteTodo={() => onDeleteTodo(todo.id)}
        onUpdate={onUpdate}
      />
    ))}
  </section>
);
