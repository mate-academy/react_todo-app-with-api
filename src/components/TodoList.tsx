import React from 'react';
import { Todo } from '../types/Todo';
import TodoItem from './TodoItem';

interface TodoListProps {
  todos: Todo[];
  allTodos: Todo[];
  handleDeleteTodo: (todoId: number) => void;
  handleToggleTodo: (todo: Todo) => void;
  handleUpdateTitle: (todoId: number, title: string) => Promise<void>;
  toggleAll: () => void;
  areAllCompleted: boolean;
}

const TodoList: React.FC<TodoListProps> = ({
  todos,
  allTodos,
  handleDeleteTodo,
  handleToggleTodo,
  handleUpdateTitle,
  toggleAll,
  areAllCompleted,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {allTodos.length > 0 && (
        <button
          type="button"
          className={`todoapp__toggle-all ${areAllCompleted ? 'active' : ''}`}
          data-cy="ToggleAllButton"
          onClick={toggleAll}
        />
      )}

      {todos.map(todo => (
        <TodoItem
          key={todo.id}
          todo={todo}
          handleDeleteTodo={handleDeleteTodo}
          handleToggleTodo={handleToggleTodo}
          handleUpdateTitle={handleUpdateTitle}
        />
      ))}
    </section>
  );
};

export default TodoList;
