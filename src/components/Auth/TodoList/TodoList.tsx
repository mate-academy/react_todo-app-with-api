import React from 'react';

import { Todo } from '../../../types/Todo';
import { NewTodo } from '../NewTodo';
import { TodoInfo } from '../TodoInfo';

type Props = {
  todos: Todo[];
  isAdding: boolean;
  tempTodoTitle: string;
  handleTodoDeleting: (id: number) => void;
  toggleStatus: (todoId: number, compelted: boolean) => Promise<void>;
  loadingTodoIds: number[];
  handleTitleChange: (event: React.FormEvent,
    todoId: number,
    title: string
  ) => Promise<void>;
};

export const TodoList: React.FC<Props> = ({
  todos,
  isAdding,
  tempTodoTitle,
  handleTodoDeleting,
  toggleStatus,
  loadingTodoIds,
  handleTitleChange,
}) => (
  <section className="todoapp__main" data-cy="TodoList">
    {todos.map(todo => (
      <TodoInfo
        key={todo.id}
        todo={todo}
        handleTodoDeleting={handleTodoDeleting}
        toggleStatus={toggleStatus}
        loadingTodoIds={loadingTodoIds}
        isAdding={isAdding}
        handleTitleChange={handleTitleChange}
      />
    ))}

    {isAdding && <NewTodo tempTodoTitle={tempTodoTitle} />}
  </section>
);
