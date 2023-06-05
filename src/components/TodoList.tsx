import React from 'react';
import { TodoInfo } from './TodoInfo';
import { Todo } from '../types/Todo';

type Props = {
  todos: Todo[],
  tempoTodo: Todo | null,
  loadingTodoIds: number[];
  handleTodoRemove: (id: number) => void,
  handleTodoTitleUpdate: (todo: Todo, title?: string) => Promise<void>,
  handleTodoStatusUpdate : (todo: Todo) => void,
};

export const TodoList: React.FC<Props> = ({
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
        <TodoInfo
          todo={todo}
          loadingTodoIds={loadingTodoIds}
          handleTodoRemove={handleTodoRemove}
          handleTodoTitleUpdate={handleTodoTitleUpdate}
          handleTodoStatusUpdate={handleTodoStatusUpdate}
        />
      ))}

      {tempoTodo && (
        <TodoInfo
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
