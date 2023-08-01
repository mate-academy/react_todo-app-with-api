import React from 'react';

import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem/TodoItem';

interface Props {
  filteredTodos: Todo[],
  deleteItem: (todoId: number) => void,
  isLoading: boolean,
  setLoading: (arg: boolean) => void,
  idToDelete: number[],
  updateTodoStatus: (todo: Todo) => void,
  updateTodoTitle: (updatedTodo: Todo) => void,
  setErrorMessage: (errorMessage: string) => void,
}

export const TodoList: React.FC<Props> = ({
  filteredTodos,
  deleteItem,
  isLoading,
  setLoading,
  idToDelete,
  updateTodoStatus,
  updateTodoTitle,
  setErrorMessage,
}) => (
  <section className="todoapp__main">
    {filteredTodos.map(todo => {
      return (
        <TodoItem
          todo={todo}
          deleteItem={deleteItem}
          isLoading={isLoading}
          setLoading={setLoading}
          idToDelete={idToDelete}
          updateTodoStatus={updateTodoStatus}
          updateTodoTitle={updateTodoTitle}
          setErrorMessage={setErrorMessage}
        />
      );
    })}
  </section>
);
