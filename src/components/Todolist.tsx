import React from 'react';
import { Todo } from '../types/Todo';
import { TodoInfo } from './TodoInfo';
import { TodoItem } from './TodoItem';

type Props = {
  todos: Todo[];
  tempTodo: Todo | null;
  updatingTodoIds: number[];
  removingTodoIds: number[];
  onDelete: (todoId: number) => void;
  handleChangeStatus: (todo: Todo) => void;
  handleChangeTitle: (Todo: Todo, newTitle: string) => void;
  setUpdatingTodoIds: React.Dispatch<React.SetStateAction<number[]>>;
};

export const Todolist: React.FC<Props> = ({
  todos,
  tempTodo,
  onDelete,
  updatingTodoIds,
  removingTodoIds,
  handleChangeTitle,
  setUpdatingTodoIds,
  handleChangeStatus,
}) => (
  <ul className="todoapp__main">
    {todos.map(todo => {
      const isLoaderVisible = updatingTodoIds.includes(todo.id)
        || removingTodoIds.includes(todo.id);

      return (
        <TodoInfo
          todo={todo}
          key={todo.id}
          onDelete={onDelete}
          isLoaderVisible={isLoaderVisible}
          handleChangeTitle={handleChangeTitle}
          setUpdatingTodoIds={setUpdatingTodoIds}
          handleChangeStatus={handleChangeStatus}
        />
      );
    })}

    {tempTodo && (
      <TodoItem
        tempTodo={tempTodo}
      />
    )}
  </ul>
);
