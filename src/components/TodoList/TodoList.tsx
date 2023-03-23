import React from 'react';
import { Todo } from '../../types/Todo';
import { TodoInfo } from '../TodoInfo';

type Props = {
  todos: Todo[];
  tempTodo: Todo | null;
  handleUpdate: (id: number, data: boolean | string) => void;
  removeTodo: (id:number) => void;
  updatingIds: number[];
};

export const TodoList: React.FC<Props> = ({
  todos,
  tempTodo,
  handleUpdate,
  removeTodo,
  updatingIds,
}) => {
  return (
    <ul className="todoapp__main">
      {todos.map(todo => (
        <TodoInfo
          key={todo.id}
          todo={todo}
          handleUpdate={handleUpdate}
          removeTodo={removeTodo}
          updatingIds={updatingIds}
        />
      ))}

      {tempTodo && (
        <TodoInfo
          todo={tempTodo}
          handleUpdate={handleUpdate}
          removeTodo={removeTodo}
          updatingIds={updatingIds}
        />
      )}
    </ul>
  );
};
