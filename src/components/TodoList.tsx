import React from 'react';
import { Todo } from '../types/Todo';
import { TodoItem } from './TodoItem';
import { Method } from '../App';

type Props = {
  editTodo: boolean;
  setEditTodo: (id: number) => void;
  setRemoveEditTodo: () => void;
  filteredTodos: Todo[];
  tempTodo: Todo | null;
  loadingForTodo: number[];
  handleDelete: (id: number) => void;
  handleUpdating: (todo: Todo, method: Method) => void;
  todoId: number;
  updateTodo: (todo: Todo) => void;
  setError: () => void;
  setUpdateError: () => void;
};

export const TodoList: React.FC<Props> = ({
  editTodo,
  setEditTodo,
  setRemoveEditTodo,
  filteredTodos,
  tempTodo,
  loadingForTodo,
  handleDelete,
  handleUpdating,
  todoId: todoId,
  updateTodo,
  setError,
  setUpdateError,
}) => (
  <section className="todoapp__main" data-cy="TodoList">
    {filteredTodos.map(todo => (
      <TodoItem
        todo={todo}
        editTodo={editTodo}
        setEditTodo={setEditTodo}
        setRemoveEditTodo={setRemoveEditTodo}
        key={todo.id}
        loadingForTodo={loadingForTodo}
        handleDelete={handleDelete}
        handleUpdating={handleUpdating}
        todoId={todoId}
        updateTodoStatus={updateTodo}
        setError={setError}
        setUpdateError={setUpdateError}
      />
    ))}
    {tempTodo !== null && (
      <TodoItem
        todo={tempTodo}
        isTempTodo
        setRemoveEditTodo={setRemoveEditTodo}
        handleDelete={handleDelete}
        handleUpdating={handleUpdating}
        updateTodoStatus={updateTodo}
        setEditTodo={setEditTodo}
        setError={setError}
        setUpdateError={setUpdateError}
      />
    )}
  </section>
);
