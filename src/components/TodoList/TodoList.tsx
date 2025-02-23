import React from 'react';

import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem/TodoItem';

type Props = {
  todos: Todo[];
  onDelete: (todoId: number) => void;
  processingTodoIds: number[];
  onUpdateStatus: (todo: Todo) => void;
  onUpdateTitle: (todo: Todo) => Promise<void>;
  inputRef: React.RefObject<HTMLInputElement>;
};

export const TodoList: React.FC<Props> = ({
  todos,
  onDelete,
  processingTodoIds,
  onUpdateStatus,
  onUpdateTitle,
  inputRef,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => {
        const isTodoProcessing = processingTodoIds.includes(todo.id);

        return (
          <TodoItem
            key={todo.id}
            todo={todo}
            isShowLoader={isTodoProcessing}
            onDelete={onDelete}
            onUpdateStatus={onUpdateStatus}
            onUpdateTitle={onUpdateTitle}
            inputRef={inputRef}
          />
        );
      })}
    </section>
  );
};
