import React from 'react';
import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem';

type Props = {
  todos: Todo[],
  deleteTodo: (id: number) => () => void,
  isLoading: boolean,
  selectedTodo: Todo | null,
  setSelectedTodo: (todo: Todo | null) => void,
  updateTodo: (todo: Todo) => void,
  groupSelected: Todo [] | null,
};

export const TodoList: React.FC<Props> = ({
  todos,
  deleteTodo,
  isLoading,
  selectedTodo,
  setSelectedTodo,
  updateTodo,
  groupSelected,
}) => {
  return (
    <section className="todoapp__main">
      {todos.map(todo => (
        <TodoItem
          selectedTodo={selectedTodo}
          setSelectedTodo={setSelectedTodo}
          isLoading={isLoading}
          key={todo.id}
          todo={todo}
          deleteTodo={deleteTodo}
          updateTodo={updateTodo}
          groupSelected={groupSelected}
        />
      ))}
    </section>
  );
};
