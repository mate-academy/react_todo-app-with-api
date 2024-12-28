import React from 'react';
import { Todo } from '../types/Todo';
import { TodoItem } from './TodoItem';

type Props = {
  todos: Todo[];
  addTodoId: number | null;
  setAddTodoId: React.Dispatch<React.SetStateAction<number | null>>;
  handleDeleteTodo: (id: number) => void;
  updateTodoTitleById: (currentTodo: Todo) => void;
  updateCompletedById: (todoId: number) => void;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  setErrorMessage: React.Dispatch<React.SetStateAction<string>>;
};

export const TodoList: React.FC<Props> = ({
  todos,
  addTodoId,
  setAddTodoId,
  handleDeleteTodo,
  updateTodoTitleById,
  updateCompletedById,
  setLoading,
  setErrorMessage,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => (
        <TodoItem
          todo={todo}
          key={todo.id}
          addTodoId={addTodoId}
          setAddTodoId={setAddTodoId}
          handleDeleteTodo={handleDeleteTodo}
          updateTodoTitleById={updateTodoTitleById}
          updateCompletedById={updateCompletedById}
          setLoading={setLoading}
          setErrorMessage={setErrorMessage}
        />
      ))}
    </section>
  );
};
