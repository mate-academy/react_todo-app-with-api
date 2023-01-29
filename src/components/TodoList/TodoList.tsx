import React, { memo } from 'react';
import { Todo } from '../../types/Todo';
import { TodoInfo } from '../TodoInfo/TodoInfo';

type Props = {
  todos: Todo[];
  onDeleteTodo: (todoId: number) => void;
  tempTodo: Todo | null;
  isNewTodoLoading: boolean;
  onChangeTodoStatus: (todo: Todo) => void;
};

export const TodoList: React.FC<Props> = memo(
  ({
    todos, onDeleteTodo, tempTodo, isNewTodoLoading, onChangeTodoStatus,
  }) => {
    return (
      <section className="todoapp__main" data-cy="TodoList">
        {todos.map((todo) => (
          <TodoInfo
            todo={todo}
            onDeleteTodo={onDeleteTodo}
            onChangeTodoStatus={onChangeTodoStatus}
          />
        ))}

        {tempTodo && (
          <TodoInfo
            todo={tempTodo}
            onDeleteTodo={onDeleteTodo}
            isNewTodoLoading={isNewTodoLoading}
            onChangeTodoStatus={onChangeTodoStatus}
          />
        )}
      </section>
    );
  },
);
