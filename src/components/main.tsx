import React from 'react';
import { Todo } from '../types/Todo';
import { TodoInfo } from './todoInfo';
import { TempTodo } from './tempTodo';

type Props = {
  todos: Todo[],
  addComplitedTodo: (todoId:number) => void,
  onTodoDelete: (id: number) => void,
  onTodoChangingStatus: (todoId: number, todoStatus: boolean) => Promise<void>
  todoLoadingId: number[],
  tempTodo: Todo | null,
};

export const Main: React.FC<Props> = ({
  todos,
  addComplitedTodo,
  onTodoDelete,
  onTodoChangingStatus,
  todoLoadingId,
  tempTodo,
}) => {
  return (
    <section className="todoapp__main">
      {todos.map(todo => {
        return (
          <TodoInfo
            todoInfo={todo}
            key={todo.id}
            addComplitedTodo={addComplitedTodo}
            onTodoDelete={onTodoDelete}
            onTodoChangingStatus={onTodoChangingStatus}
            todoLoadingId={todoLoadingId}
          />
        );
      })}
      {tempTodo !== null && (
        <TempTodo title={tempTodo.title} />
      )}
    </section>
  );
};
