/* eslint-disable jsx-a11y/label-has-associated-control */
import React from 'react';
import classNames from 'classnames';
import { Todo, PartialTodo } from '../../types/Todo';
import { TodoItem } from '../TodoItem';

type TodoListProps = {
  todos: Todo[];
  tempTodo: Todo | null;
  deleteTodo: (todoId: Todo['id']) => void;
  handleActiveTodo: (todoId: Todo['id']) => void;
  activeTodo: Todo[];
  onEditTodo: (todo: PartialTodo) => Promise<boolean | null>;
  filteredContent: Todo[] | null;
};

export const TodoList: React.FC<TodoListProps> = ({
  todos,
  tempTodo,
  deleteTodo,
  handleActiveTodo,
  activeTodo,
  onEditTodo,
  filteredContent,
}) => {
  const visibleTodo = filteredContent !== null ? filteredContent : todos;

  return (
    <section className={classNames('todoapp__main')} data-cy="TodoList">
      {visibleTodo.map(todo => (
        <TodoItem
          key={todo.id}
          todo={todo}
          deleteTodo={deleteTodo}
          handleActiveTodo={handleActiveTodo}
          activeTodo={activeTodo}
          onEditTodo={onEditTodo}
        />
      ))}

      {tempTodo && (
        <TodoItem
          todo={tempTodo}
          deleteTodo={() => {}}
          handleActiveTodo={() => {}}
          onEditTodo={() => {}}
        />
      )}
    </section>
  );
};
