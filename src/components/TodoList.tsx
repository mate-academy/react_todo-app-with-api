import React, { useEffect, useRef } from 'react';
import { Todo } from '../types/Todo';
import { TodoItem } from './Item/TodoItem';

type TodoListProps = {
  todos: Todo[];
  filterType: 'All' | 'Active' | 'Completed';
  handleDeleteTodo: (todo: Todo) => void;
  handleToggleComplete: (todo: Todo) => void;
  todoItem: Todo | null;
  currentTodoLoading: number | null;
  handleErrorMessage: (message: string | null) => void;
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
  const newTodoInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (todoItem && newTodoInputRef.current) {
      newTodoInputRef.current.focus();
    }
  }, [todoItem]);

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
          handleDelete={handleDeleteTodo}
          handleToggleComplete={handleToggleComplete}
          isLoading={currentTodoLoading === todo.id}
          handleErrorMessage={handleErrorMessage}
        />
      ))}
      {todoItem && (
        <TodoItem
          key={todoItem.id}
          todo={todoItem}
          handleDelete={handleDeleteTodo}
          handleToggleComplete={handleToggleComplete}
          isLoading
          handleErrorMessage={handleErrorMessage}
        />
      )}
    </section>
  );
};
