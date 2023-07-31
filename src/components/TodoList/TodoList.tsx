import React from 'react';
import { HandleTodoEdit, Todo } from '../../types';
import { TodoItem } from '../TodoItem';

type Props = {
  todos: Todo[],
  onDelete: (id: number) => void,
  idsToDelete: number[],
  idsToToggle: number[],
  onToggle: (todo: Todo) => void,
  todoOnEdit: Todo | null,
  setTodoOnEdit: (todo: Todo | null) => void,
  handleTodoEdit: HandleTodoEdit,
};

export const TodoList: React.FC<Props> = ({
  todos,
  onDelete,
  idsToDelete,
  idsToToggle,
  onToggle,
  todoOnEdit,
  setTodoOnEdit,
  handleTodoEdit,
}) => {
  return (
    <section className="todoapp__main">
      {todos.map(todo => (
        <TodoItem
          key={todo.id}
          todo={todo}
          onDelete={onDelete}
          idsToDelete={idsToDelete}
          idsToToggle={idsToToggle}
          onToggle={onToggle}
          todoOnEdit={todoOnEdit}
          setTodoOnEdit={setTodoOnEdit}
          handleTodoEdit={handleTodoEdit}
        />
      ))}
    </section>
  );
};
