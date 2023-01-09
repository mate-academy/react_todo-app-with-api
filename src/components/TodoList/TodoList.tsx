import React from 'react';
import { Todo } from '../../types/Todo';
import { TodoInfo } from '../TodoInfo';

type Props = {
  todos: Todo[];
  todosForDelete: Todo[];
  todosForUpdate: Todo[];
  onSetTodoForDelete: (todo: Todo) => void;
  onSetTodoForUpdate: (todo: Todo) => void;
};

export const TodoList: React.FC<Props> = ({
  todos,
  todosForDelete,
  todosForUpdate,
  onSetTodoForDelete,
  onSetTodoForUpdate,
}) => {
  const idTodosForDelete = todosForDelete.map(todo => todo.id);
  const idTodosForUpdate = todosForUpdate.map(todo => todo.id);

  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => (
        <TodoInfo
          key={todo.id}
          todo={todo}
          isDeleting={idTodosForDelete.includes(todo.id)}
          isUpdating={idTodosForUpdate.includes(todo.id)}
          onSetTodoForDelete={onSetTodoForDelete}
          onSetTodoForUpdate={onSetTodoForUpdate}
        />
      ))}
    </section>
  );
};
