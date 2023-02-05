import React, { FC } from 'react';
import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem/TodoItem';

type Props = {
  todos: Todo[],
  temporaryNewTodo: Todo | null,
  showError: (message: string) => void;
  onDeleteTodo: (todoId: number) => void;
  loadingTodosIds: number[];
  onUpdateTodo: (
    todoId: number,
    fieldsToUpdate: Partial<Pick<Todo, 'title' | 'completed'>>)
  => Promise<void>;
};

export const TodoList: FC<Props> = React.memo((props) => {
  const {
    todos, temporaryNewTodo, onDeleteTodo, loadingTodosIds, onUpdateTodo,
  } = props;

  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => (
        <TodoItem
          key={todo.id}
          todo={todo}
          onDelete={onDeleteTodo}
          shouldShowLoader={loadingTodosIds.includes(todo.id)}
          onUpdate={onUpdateTodo}
        />
      ))}

      {temporaryNewTodo && (
        <TodoItem
          todo={temporaryNewTodo}
          onDelete={onDeleteTodo}
          shouldShowLoader
          onUpdate={onUpdateTodo}
        />
      )}
    </section>
  );
});
