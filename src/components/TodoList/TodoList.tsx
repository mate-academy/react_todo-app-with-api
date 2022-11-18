import React from 'react';
import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem';

interface Props {
  todos: Todo[];
  removeTodoFromServer: (todoToRemoveId: number) => void;
  toggleCompletedStatus: (todoId: number, status: boolean) => Promise<void>;
  changeTodoTitle: (todoId: number, title: string) => Promise<void>;
}

export const TodoList: React.FC<Props> = ({
  todos,
  removeTodoFromServer,
  toggleCompletedStatus,
  changeTodoTitle,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(({ id, title, completed }) => (
        <TodoItem
          key={id}
          id={id}
          title={title}
          isCompleted={completed}
          removeTodoFromServer={removeTodoFromServer}
          toggleCompletedStatus={toggleCompletedStatus}
          changeTodoTitle={changeTodoTitle}
        />
      ))}
    </section>
  );
};
