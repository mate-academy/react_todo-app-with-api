import React from 'react';
import TodoItem from './TodoItem';
import { Todo } from '../types/Todo';

interface Props {
  todos: Todo[];
  onDeleteTodo: (id: number) => void;
  updateTodo: (patchTodo: Todo, title: string) => Promise<void>;
  tempTodo: Todo | null;
  loading: string | number | number[] | null;
  setLoading: (loading: string | number | null) => void;
  setErrorMessage: (message: string) => void;
  loadAll: number[];
}

const TodoList: React.FC<Props> = ({
  todos,
  onDeleteTodo,
  updateTodo,
  tempTodo,
  loading,
  setLoading,
  setErrorMessage,
  loadAll,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => (
        <TodoItem
          todo={todo}
          key={todo.id}
          onDeleteTodo={onDeleteTodo}
          onUpdateTodo={updateTodo}
          loading={loading}
          setLoading={setLoading}
          setErrorMessage={setErrorMessage}
          loadAll={loadAll}
        />
      ))}

      {tempTodo && (
        <TodoItem
          todo={tempTodo}
          key={tempTodo.id}
          onUpdateTodo={updateTodo}
          loading={loading}
          setLoading={setLoading}
          setErrorMessage={setErrorMessage}
          loadAll={loadAll}
        />
      )}
    </section>
  );
};

export default TodoList;
