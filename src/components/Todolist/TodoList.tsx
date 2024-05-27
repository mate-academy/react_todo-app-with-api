import React from 'react';
import { Todo } from '../../types/Todo';
import { Status } from '../../types/Status';
import { TodoItem } from '../TodoItem';
import { filterTodos } from '../../utils/filterTodos';

interface TodoListProps {
  todos: Todo[];
  tempTodo: Todo | null;
  selectedFilter: Status;
  handleDeleteTodo?: (id: number) => void;
  loadingTodos: number[];
  onToggle?: (todo: Todo) => void;
  handleUpdateTodo?: (updatedTodo: Todo) => void;
}

export const TodoList: React.FC<TodoListProps> = ({
  todos,
  tempTodo,
  selectedFilter,
  handleDeleteTodo = () => {},
  loadingTodos,
  onToggle = () => {},
  handleUpdateTodo = () => {},
}) => {
  const filteredTodos = filterTodos(todos, selectedFilter);

  return (
    <section className="todoapp__main" data-cy="TodoList">
      {filteredTodos.map(todo => (
        <TodoItem
          key={todo.id}
          todo={todo}
          handleDeleteTodo={handleDeleteTodo}
          isLoading={loadingTodos.includes(todo.id)}
          onToggle={onToggle}
          handleUpdateTodo={handleUpdateTodo}
        />
      ))}

      {tempTodo && (
        <TodoItem
          todo={tempTodo}
          isLoading={loadingTodos.includes(0)}
          handleDeleteTodo={() => {}}
        />
      )}
    </section>
  );
};
