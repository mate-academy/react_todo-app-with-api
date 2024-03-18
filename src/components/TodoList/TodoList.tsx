import React from 'react';
import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem/TodoItem';

type Props = {
  todos: Todo[];
  addTodoId: number | null;
  handleDeleteTodo: (id: number) => void;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  setAddTodoId: React.Dispatch<React.SetStateAction<number | null>>;
  changeTitleByid: (currentTodo: Todo) => void;
  setErrorMessage: React.Dispatch<React.SetStateAction<string>>;
  changeCopletedById: (todoId: number) => void;
};

export const TodoList: React.FC<Props> = ({
  todos,
  addTodoId,
  handleDeleteTodo,
  setLoading,
  setAddTodoId,
  changeTitleByid,
  setErrorMessage,
  changeCopletedById,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => (
        <TodoItem
          todo={todo}
          key={todo.id}
          addTodoId={addTodoId}
          handleDeleteTodo={handleDeleteTodo}
          setLoading={setLoading}
          setAddTodoId={setAddTodoId}
          changeTitleByid={changeTitleByid}
          setErrorMessage={setErrorMessage}
          changeCopletedById={changeCopletedById}
        />
      ))}
    </section>
  );
};
