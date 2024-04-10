import React from 'react';
import TodoItem from './TodoItem';
import { Todo } from '../types/Todo';

interface Props {
  todos: Todo[];
  onDeleteTodo: (id: number) => void;
  updateTodo: (patchTodo: Todo, title: string) => Promise<void>;
  tempTodo: Todo | null;
  setLoading: (loading: string | number | null) => void;
  setErrorMessage: (message: string) => void;
  loadingTodoIds: number[];
}

const TodoList: React.FC<Props> = ({
  todos,
  onDeleteTodo,
  updateTodo,
  tempTodo,
  setLoading,
  setErrorMessage,
  loadingTodoIds,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => (
        <TodoItem
          todo={todo}
          key={todo.id}
          onDeleteTodo={onDeleteTodo}
          onUpdateTodo={updateTodo}
          setLoading={setLoading}
          setErrorMessage={setErrorMessage}
          loadingTodoIds={loadingTodoIds}
        />
      ))}

      {tempTodo && (
        <TodoItem
          todo={tempTodo}
          key={tempTodo.id}
          onUpdateTodo={updateTodo}
          setLoading={setLoading}
          setErrorMessage={setErrorMessage}
          loadingTodoIds={loadingTodoIds}
        />
      )}
    </section>
  );
};

export default TodoList;
