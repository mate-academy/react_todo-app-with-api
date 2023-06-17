import React from 'react';
import { TodoItem } from './TodoItem';
import { Todo } from '../types/Todo';

type TodoListProps = {
  todos: Todo[],
  tempoTodo: Todo | null,
  loadingTodoIds: number[];
  handleTodoRemove: (id: number) => void,
  handleTodoTitleUpdate: (todo: Todo, title?: string) => Promise<void>,
  handleTodoStatusUpdate : (todo: Todo) => void,
};

export const TodoList: React.FC<TodoListProps> = ({
  todos,
  tempoTodo,
  loadingTodoIds,
  handleTodoRemove,
  handleTodoTitleUpdate,
  handleTodoStatusUpdate,
}) => {
  return (
    <ul className="todoapp__main" data-cy="TodoList">
      {todos.map((todo) => (
        <TodoItem
          todo={todo}
          loadingTodoIds={loadingTodoIds}
          handleTodoRemove={handleTodoRemove}
          handleTodoTitleUpdate={handleTodoTitleUpdate}
          handleTodoStatusUpdate={handleTodoStatusUpdate}
        />
      ))}

      {tempoTodo && (
        <TodoItem
          todo={tempoTodo}
          loadingTodoIds={loadingTodoIds}
          handleTodoRemove={handleTodoRemove}
          handleTodoTitleUpdate={handleTodoTitleUpdate}
          handleTodoStatusUpdate={handleTodoStatusUpdate}
        />
      )}
    </ul>
  );
};
