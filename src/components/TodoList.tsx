import React from 'react';
import { Todo } from '../types/Todo';
import { TodoInfo } from './TodoInfo';
import { TodoItem } from './TodoItem';

type Props = {
  todos: Todo[];
  tempTodo: Todo | null;
  removingTodoIds: number[];
  updatingTodoIds: number[];
  deleteTodoFromServer: (todoId: number) => void;
  setUpdatingTodoIds: React.Dispatch<React.SetStateAction<number[]>>;
  changeTodoStatus: (todo: Todo) => Promise<void>;
  changeTodoTitle: (todo: Todo, newTitle: string) => Promise<void>;
};

export const TodoList: React.FC<Props> = ({
  todos,
  tempTodo,
  removingTodoIds,
  deleteTodoFromServer,
  updatingTodoIds,
  setUpdatingTodoIds,
  changeTodoStatus,
  changeTodoTitle,
}) => {
  return (
    <section className="todoapp__main">
      {todos.map(todo => {
        const isLoaderVisible = updatingTodoIds.includes(todo.id)
        || removingTodoIds.includes(todo.id);

        return (
          <TodoInfo
            todo={todo}
            key={todo.id}
            onDelete={deleteTodoFromServer}
            isLoaderVisible={isLoaderVisible}
            changeTodoTitle={changeTodoTitle}
            setUpdatingTodoIds={setUpdatingTodoIds}
            changeTodoStatus={changeTodoStatus}
          />
        );
      })}

      {tempTodo && (
        <TodoItem
          tempTodo={tempTodo}
        />
      )}
    </section>
  );
};
