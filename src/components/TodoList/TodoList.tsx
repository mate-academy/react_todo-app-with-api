import React from 'react';
import { TodoInfo } from '../TodoInfo';
import { Todo } from '../../types/Todo';

type Props = {
  todos: Todo[],
  handleDelete: (todoId: number) => void,
  handleUpdateTitle: (updatedTodo: Todo, newTitle: string) => void,
  handleUpdateCompleted: (todo: Todo) => void,
  updatedTodoId: boolean | number,
};

export const TodoList: React.FC<Props> = React.memo(({
  todos,
  handleDelete,
  handleUpdateTitle,
  updatedTodoId,
  handleUpdateCompleted,
}) => {
  return (
    <section className="todoapp__main">
      {todos.map(todo => (
        <TodoInfo
          key={todo.id}
          todo={todo}
          handleDelete={handleDelete}
          handleUpdateTitle={handleUpdateTitle}
          updatedTodoId={updatedTodoId}
          handleUpdateCompleted={handleUpdateCompleted}
        />
      ))}
    </section>
  );
});
