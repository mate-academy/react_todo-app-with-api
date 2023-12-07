import React from 'react';
import { Todo } from '../types/Todo';
import { TodoItem } from './TodoItem';
import { Errors } from '../types/Errors';

interface Props {
  todos: Todo[],
  currentId: number | null,
  handleDeleteTodo: (todo: Todo) => Promise<void>,
  handleUpdateTodo: (todo: Todo) => Promise<Todo | void>,
  setErrorMessage: (message: Errors | '') => void,
  setTempTodo: React.Dispatch<React.SetStateAction<Todo | null>>;
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>;
}

export const TodoList: React.FC<Props> = ({
  todos,
  currentId,
  handleUpdateTodo,
  handleDeleteTodo,
  setErrorMessage,
  setTempTodo,
  setTodos,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => (
        <TodoItem
          key={todo.id}
          todo={todo}
          currentId={currentId}
          handleDeleteTodo={handleDeleteTodo}
          handleUpdateTodo={handleUpdateTodo}
          setErrorMessage={setErrorMessage}
          setTempTodo={setTempTodo}
          setTodos={setTodos}
        />
      ))}
    </section>
  );
};
