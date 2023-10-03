import React from 'react';
import { ErrorType, Todo, FilterType } from '../types/Todo';
import { TodoItem } from './TodoItem';
import { TempTodoItem } from './TempTodoItem';

type TodoListProps = {
  todos: Todo[];
  filterType: FilterType;
  handleDeleteTodo: (todo: Todo) => void;
  handleToggleComplete: (todo: Todo) => void;
  todoItem: Todo | null;
  currentTodoLoading: number | null;
  handleErrorMessage: (message: ErrorType | null) => void;
  handleTitleUpdate: (todoId: number, newTitle: string) => void;
};

export const TodoList: React.FC<TodoListProps> = ({
  todos,
  filterType,
  handleDeleteTodo,
  handleToggleComplete,
  todoItem,
  currentTodoLoading,
  handleErrorMessage,
  handleTitleUpdate,
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
          handleTitleUpdate={handleTitleUpdate}
        />
      ))}
      {todoItem
        && (
          <TempTodoItem
            todoItem={todoItem}
          />
        )}
    </section>
  );
};
