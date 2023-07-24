import React from 'react';
import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem/TodoItem';

interface TodoListProps {
  todos: Todo[];
  onDeleteTodo: (todoId: number) => void;
  loadingTodoIds: number[];
  tempTodo: Todo | null,
  onToggleTodo: (todoId: number, completed: boolean) => void;
  onEditTodo: (todoId: number, newTitle: string) => void;
}

export const TodoList: React.FC<TodoListProps> = ({
  todos,
  onDeleteTodo,
  loadingTodoIds,
  tempTodo,
  onToggleTodo,
  onEditTodo,
}) => {
  return (
    <section className="todoapp__main">
      <ul className="todo-list">
        {todos.map((todo) => (
          <TodoItem
            key={todo.id}
            todo={todo}
            onDeleteTodo={onDeleteTodo}
            loading={loadingTodoIds.includes(todo.id)}
            onToggleTodo={onToggleTodo}
            onEditTodo={onEditTodo}
          />
        ))}

        {tempTodo && (
          <TodoItem
            key={tempTodo.id}
            todo={tempTodo}
            onDeleteTodo={onDeleteTodo}
            loading
            onToggleTodo={onToggleTodo}
            onEditTodo={onEditTodo}
          />
        )}
      </ul>
    </section>
  );
};
