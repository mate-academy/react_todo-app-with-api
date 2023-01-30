import React from 'react';
import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem/TodoItem';

type Props = {
  todos: Todo[],
  tempTodo: Todo | null,
  onDeleteTodo: (todoId: number) => Promise<any>;
  deletingTodoIds: number[],
  onUpdateTodo: (todo: Todo) => Promise<any>,
  updatingTodoIds: number[],
  showError: (message: string) => void,
  updateTodoTitle: (todo: Todo) => void,

};

export const TodoList: React.FC<Props> = ({
  todos,
  tempTodo,
  onDeleteTodo,
  deletingTodoIds,
  onUpdateTodo,
  updatingTodoIds,
  showError,
  updateTodoTitle,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => (
        <TodoItem
          todo={todo}
          key={todo.id}
          onDeleteTodo={onDeleteTodo}
          isDeleting={deletingTodoIds.includes(todo.id)}
          onUpdateTodo={onUpdateTodo}
          isUpdating={updatingTodoIds.includes(todo.id)}
          showError={showError}
          updateTodoTitle={updateTodoTitle}
        />
      ))}
      {tempTodo && (
        <TodoItem
          todo={tempTodo}
          onDeleteTodo={onDeleteTodo}
          isDeleting={deletingTodoIds.includes(tempTodo.id)}
          onUpdateTodo={onUpdateTodo}
          isUpdating={updatingTodoIds.includes(tempTodo.id)}
          showError={showError}
          updateTodoTitle={updateTodoTitle}
        />
      )}
    </section>
  );
};
