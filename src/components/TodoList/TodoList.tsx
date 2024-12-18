import React from 'react';

import { TodoItem } from '../TodoItem/TodoItem';

import { Todo } from '../../types/Todo';

type Props = {
  filteredTodos: Todo[];
  updateTodolist: React.Dispatch<React.SetStateAction<Todo[]>>;
  onError: React.Dispatch<React.SetStateAction<string>>;
  todoList: Todo[];
  processedIds: number[];
  updateProcessedIds: React.Dispatch<React.SetStateAction<number[]>>;
};

export const TodoList: React.FC<Props> = ({
  filteredTodos,
  updateTodolist,
  onError,
  todoList,
  processedIds,
  updateProcessedIds,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {filteredTodos.map(todo => {
        const { id, completed, title } = todo;

        return (
          <TodoItem
            key={id}
            todoId={id}
            completed={completed}
            title={title}
            updateTodolist={updateTodolist}
            onError={onError}
            todoList={todoList}
            processedIds={processedIds}
            updateProcessedIds={updateProcessedIds}
          />
        );
      })}
    </section>
  );
};
