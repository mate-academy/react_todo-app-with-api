import React from 'react';
import { ErrorType, Todo } from '../types/Todo';
import { TodoItem } from './TodoItem';

type TodoListProps = {
  todos: Todo[];
  filterType: 'All' | 'Active' | 'Completed';
  handleDeleteTodo: (todo: Todo) => void;
  handleToggleComplete: (todo: Todo) => void;
  todoItem: Todo | null;
  currentTodoLoading: number | null;
  handleErrorMessage: (message: ErrorType | null) => void;
};

export const TodoList: React.FC<TodoListProps> = ({
  todos,
  filterType,
  handleDeleteTodo,
  handleToggleComplete,
  todoItem,
  currentTodoLoading,
  handleErrorMessage,
}) => {
  const filterTodos = (todosArray: Todo[]) => {
    return todosArray.filter((todo) => {
      if (filterType === 'All') {
        return true;
      }

      if (filterType === 'Active') {
        return !todo.completed;
      }

      return todo.completed;
    });
  };

  return (
    <section className="todoapp__main" data-cy="TodoList">
      {filterTodos(todos).map((todo) => (
        <TodoItem
          key={todo.id}
          todo={todo}
          handleDeleteTodo={handleDeleteTodo}
          handleToggleComplete={handleToggleComplete}
          isLoading={currentTodoLoading === todo.id}
          handleErrorMessage={handleErrorMessage}
        />
      ))}
      {todoItem && (
        <TodoItem
          key={todoItem.id}
          todo={todoItem}
          handleDeleteTodo={handleDeleteTodo}
          handleToggleComplete={handleToggleComplete}
          isLoading
          handleErrorMessage={handleErrorMessage}
        />
      )}
    </section>
  );
};
