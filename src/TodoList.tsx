// import React, { useState } from 'react';
import { TodoInfo } from './TodoInfo';
import { TodoItem } from './TodoItem';
import { Todo } from './types/Todo';

type Props = {
  todosToShow: Todo[],
  tempTodo: Todo | null,
  onDelete: (id: number) => void,
  onStatusChange: (todo: Todo) => void,
  onTitleChange: (todo: Todo, todoTitle: string) => void,
  loaderForHeader: boolean,
  setLoaderForHeader: (a: boolean) => void,
};

export const TodoList: React.FC<Props> = ({
  todosToShow,
  tempTodo,
  onDelete,
  onStatusChange,
  onTitleChange,
  loaderForHeader,
  setLoaderForHeader,
}) => {
  return (
    <ul className="todoapp__main">
      {todosToShow.map(todo => (
        <TodoInfo
          todo={todo}
          onDelete={onDelete}
          key={todo.id}
          onStatusChange={onStatusChange}
          onTitleChange={onTitleChange}
          loaderForHeader={loaderForHeader}
          setLoaderForHeader={setLoaderForHeader}
        />
      ))}
      {tempTodo && <TodoItem tempTodo={tempTodo} />}
    </ul>
  );
};
