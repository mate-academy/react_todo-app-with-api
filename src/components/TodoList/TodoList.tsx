import React from 'react';
import { Todo } from '../../types/Todo';
import { TodoInfo } from '../TodoInfo';

type Props = {
  todos: Todo[];
  idsTodosForDelete: number[];
  todosForUpdate: Todo[];
  onSetTodoIdForDelete: (todoId: number) => void;
  onSetTodoForUpdate: (todo: Todo) => void;
};

export const TodoList: React.FC<Props> = React.memo(
  ({
    todos,
    idsTodosForDelete,
    todosForUpdate,
    onSetTodoIdForDelete,
    onSetTodoForUpdate,
  }) => {
    const idTodosForUpdate = todosForUpdate.map(todo => todo.id);

    return (
      <section className="todoapp__main" data-cy="TodoList">
        {todos.map(todo => (
          <TodoInfo
            key={todo.id}
            todo={todo}
            isDeleting={idsTodosForDelete.includes(todo.id)}
            isUpdating={idTodosForUpdate.includes(todo.id)}
            onSetTodoIdForDelete={onSetTodoIdForDelete}
            onSetTodoForUpdate={onSetTodoForUpdate}
          />
        ))}
      </section>
    );
  },
);
