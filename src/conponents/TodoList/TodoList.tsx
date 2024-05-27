import React from 'react';
import { Status } from '../../types/Status';
import { Todo } from '../../types/Todo';
import { filterTodos } from '../../utils/filteredTodos';
import { TodoItem } from '../TodoItem/TodoItem';

interface Props {
  todos: Todo[];
  tempTodo: Todo | null;
  selectedFilter: Status;
  handleDeleteTodo?: (id: number) => void;
  loadingTodos: number[];
  onToggle?: (todo: Todo) => void;
  handleUpdateTodo?: (updatedTodo: Todo) => void;
}

export const TodoList: React.FC<Props> = ({
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
