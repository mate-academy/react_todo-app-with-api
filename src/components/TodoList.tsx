import React from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import PropTypes from 'prop-types';
import { Todo } from '../types/Todo';
import { TodoItem } from './Todo';
interface Props {
  todos: Todo[];
  tempTodo: Todo | null;
  loadingTodoIds: number[];
  onDelete: (id: number) => void;
  onUpdate: (id: number, data: Partial<Todo>) => Promise<void>;
}

export const TodoList: React.FC<Props> = ({
  todos,
  tempTodo,
  loadingTodoIds,
  onDelete,
  onUpdate,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => (
        <TodoItem
          key={todo.id}
          todo={todo}
          isLoading={loadingTodoIds.includes(todo.id)}
          onDelete={onDelete}
          onUpdate={onUpdate}
        />
      ))}

      {tempTodo && <TodoItem todo={tempTodo} isLoading />}
    </section>
  );
};

TodoList.propTypes = {
  todos: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      userId: PropTypes.number.isRequired,
      title: PropTypes.string.isRequired,
      completed: PropTypes.bool.isRequired,
    }).isRequired,
  ).isRequired,
  tempTodo: PropTypes.shape({
    id: PropTypes.number.isRequired,
    userId: PropTypes.number.isRequired,
    title: PropTypes.string.isRequired,
    completed: PropTypes.bool.isRequired,
  }),
  loadingTodoIds: PropTypes.arrayOf(PropTypes.number.isRequired).isRequired,
  onDelete: PropTypes.func.isRequired,
  onUpdate: PropTypes.func.isRequired,
};
