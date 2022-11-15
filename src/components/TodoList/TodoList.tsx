import React from 'react';
import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem';

interface Props {
  filteredTodos: Todo[],
  temporaryTodo: Todo,
  isAdding: boolean,
  loadingIds: number[],
  deleteTodoFromServer: (todoId: number) => void,
  patchTodoStatusOnServer: (todoId: number, status: boolean) => void,
  patchTodoTitleOnServer: (todoId: number, title: string) => void,
}

export const TodoList: React.FC<Props> = ({
  filteredTodos,
  temporaryTodo,
  isAdding,
  loadingIds,
  deleteTodoFromServer,
  patchTodoStatusOnServer,
  patchTodoTitleOnServer,
}) => (
  <section className="todoapp__main" data-cy="TodoList">
    {filteredTodos.map(todo => (
      <TodoItem
        key={todo.id}
        todo={todo}
        isAdding={isAdding}
        loadingIds={loadingIds}
        deleteTodoFromServer={deleteTodoFromServer}
        patchTodoStatusOnServer={patchTodoStatusOnServer}
        patchTodoTitleOnServer={patchTodoTitleOnServer}
      />
    ))}

    {isAdding && (
      <TodoItem
        todo={temporaryTodo}
        isAdding={isAdding}
        loadingIds={loadingIds}
        deleteTodoFromServer={deleteTodoFromServer}
        patchTodoStatusOnServer={patchTodoStatusOnServer}
        patchTodoTitleOnServer={patchTodoTitleOnServer}
      />
    )}
  </section>
);
