import React from 'react';
import { Todo } from '../../types/Todo';
import { TodoInfo } from '../TodoInfo/TodoInfo';

type Props = {
  todos: Todo[];
  onTodoDelete: (todoId: number) => Promise<void>;
  tempTodo: Todo | null;
  updateStatusTodo?: (todo: Todo) => void;
  idsToChange: number[];
  editTitleTodo: (todo: Todo, title: string) => void;
};

export const TodoList: React.FC<Props> = ({
  todos,
  onTodoDelete,
  tempTodo,
  updateStatusTodo,
  idsToChange = [],
  editTitleTodo,
}) => {
  return (
    <ul className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => {
        return (
          <TodoInfo
            todo={todo}
            key={todo.id}
            onDelete={onTodoDelete}
            updateStatusTodo={updateStatusTodo}
            idsToChange={idsToChange}
            editTitleTodo={editTitleTodo}
          />
        );
      })}

      {tempTodo && (
        <TodoInfo
          todo={tempTodo}
          onDelete={onTodoDelete}
          editTitleTodo={editTitleTodo}
        />
      )}
    </ul>
  );
};
