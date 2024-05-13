import React from 'react';
import { Todo } from '../types/Todo';
import TodoItem from './TodoItem';

interface TodoListProps {
  todos: Todo[];
  filter: 'all' | 'active' | 'completed';
  onDeleteTodo: (id: number) => void;
  tempTodo: string;
  pending: number | null;
  handleToggleTodo: (id: number) => void;
  handleUpdateTodo: (id: number, title: string, completed: boolean) => void;
}

const TodoList: React.FC<TodoListProps> = ({
  todos,
  filter,
  onDeleteTodo,
  tempTodo,
  pending,
  handleToggleTodo,
  handleUpdateTodo,
}) => {
  const filteredTodos = () => {
    switch (filter) {
      case 'all':
        return todos;
      case 'active':
        return todos.filter(todo => !todo.completed);
      case 'completed':
        return todos.filter(todo => todo.completed);
      default:
        return todos;
    }
  };

  return (
    <section className="todoapp__main" data-cy="TodoList">
      {tempTodo && (
        <TodoItem
          todo={{ title: tempTodo, id: -1, data: '', completed: false } as Todo}
          onDeleteTodo={onDeleteTodo}
          pending={pending}
          handleToggleTodo={() => handleToggleTodo}
          handleUpdateTodo={() => handleUpdateTodo}
        />
      )}
      {filteredTodos().map((todo: Todo) => (
        <TodoItem
          key={todo.id}
          todo={todo}
          onDeleteTodo={onDeleteTodo}
          pending={pending}
          handleToggleTodo={() => handleToggleTodo(todo.id)}
          handleUpdateTodo={() =>
            handleUpdateTodo(todo.id, todo.title, todo.completed)
          }
        />
      ))}
    </section>
  );
};

export default TodoList;
