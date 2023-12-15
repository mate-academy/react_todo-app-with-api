import React, { useState } from 'react';

import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem/TodoItem';

import { Errors } from '../../types/Errors';

interface TodoListProps {
  todoList: Todo[];
  filterTodoList: (todoId: number) => void;
  setErrorMessage: (setErrorMessage: Errors | null) => void;
  handleTodoUpdated: (todo: Todo) => void;
}

export const TodoList: React.FC<TodoListProps> = ({
  todoList,
  filterTodoList,
  setErrorMessage,
  handleTodoUpdated,
}) => {
  const [currentEditing, setCurrentEditing] = useState<number | null>(null);

  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todoList.map(todo => (
        <TodoItem
          todo={todo}
          key={todo.id}
          filterTodoList={filterTodoList}
          setErrorMessage={setErrorMessage}
          handleTodoUpdated={handleTodoUpdated}
          currentEditing={currentEditing}
          setCurrentEditing={setCurrentEditing}
        />
      ))}
    </section>
  );
};
