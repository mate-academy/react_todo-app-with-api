import React from 'react';
import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem/TodoItem';

type Props = {
  todos: Todo[];
  tempTodo: Todo | null;
  handleDeleteTodo: (id: number) => void;
  loadingTodo: number[];
  handleToggle: (todo: Todo) => void;
  handleEdit: (todo: Todo, updatedTitle: string) => Promise<boolean>;
  inputRef: React.RefObject<HTMLInputElement>;
};

export const TodoList: React.FC<Props> = ({
  todos,
  tempTodo,
  handleDeleteTodo,
  loadingTodo,
  handleToggle,
  handleEdit,
  inputRef,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => (
        <TodoItem
          key={todo.id}
          todo={todo}
          onDelete={handleDeleteTodo}
          loadingTodo={loadingTodo}
          handleToggle={handleToggle}
          handleEdit={handleEdit}
          inputRef={inputRef}
        />
      ))}
      {tempTodo && (
        <TodoItem
          key={tempTodo.id}
          todo={tempTodo}
          onDelete={() => {}}
          loadingTodo={[0]}
          handleToggle={handleToggle}
          handleEdit={handleEdit}
          inputRef={inputRef}
        />
      )}
    </section>
  );
};
