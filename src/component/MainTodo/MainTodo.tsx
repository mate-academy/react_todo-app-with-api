import React from 'react';
import { Todo } from '../../types/Todo';
import { MainList } from './MainList';

interface Props {
  todos: Todo[];
  deleteToDo: (userId: number) => void;
  completedTodo: (userId: number) => void;
  setEditableTodo: (editedTodo: Todo) => void;
  tempTodo: Todo | null;
}

export const MainTodo: React.FC<Props> = ({
  todos,
  deleteToDo,
  completedTodo,
  setEditableTodo,
  tempTodo,
}) => {
  return (
    <section className="todoapp__main">
      {todos.map((todo) => (
        <MainList
          todo={todo}
          key={todo.id}
          deleteToDo={deleteToDo}
          completedTodo={completedTodo}
          setEditableTodo={setEditableTodo}
        />
      ))}
      {tempTodo && (
        <MainList
          todo={tempTodo}
          key={tempTodo.id}
          deleteToDo={deleteToDo}
          completedTodo={completedTodo}
          setEditableTodo={setEditableTodo}
        />
      )}
    </section>
  );
};
