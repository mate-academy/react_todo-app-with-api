import React from 'react';
import { Todo } from '../../types/Todo';
import { TodoappItem } from '../TodoappItem/TodoappItem';

type Props = {
  todos: Todo[];
  processingTodoIds: number[];
  handleDelete: (id: number) => Promise<void>;
  temporaryTodo: Todo | null;
  setTodosError: (error: string) => void;
  onTodoUpdate: (todo: Todo) => Promise<void>
};

export const TodoappList: React.FC<Props> = ({
  todos,
  processingTodoIds,
  handleDelete,
  temporaryTodo,
  setTodosError,
  onTodoUpdate,
}) => {
  return (
    <ul className="todoapp__list" data-cy="TodoList">
      {todos.map((todo) => (
        <TodoappItem
          key={todo.id}
          todo={todo}
          onDelete={() => handleDelete(todo.id)}
          setTodosError={setTodosError}
          isLoading={processingTodoIds.includes(todo.id)}
          onTodoUpdate={onTodoUpdate}
        />
      ))}

      {/* Display the temporary todo with loader if present */}
      {temporaryTodo && (
        <TodoappItem
          todo={temporaryTodo}
          setTodosError={setTodosError}
          isLoading={processingTodoIds.includes(0)}
          onTodoUpdate={onTodoUpdate}
        />
      )}
    </ul>
  );
};
