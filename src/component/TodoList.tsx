import React from 'react';
import { Todo } from '../types/Todo';
import { TodoItem } from './TodoItem';

type Props = {
  filteredTodos: Todo[];
  handleDeleteTodo: (id: number) => void;
  isLoadingTodo: number[];
  handleUpdateTodo: (todo: Todo) => void;
  editingTodoId: number | null;
  setEditingTodoId: (value: number | null) => void;
};

export const TodoList: React.FC<Props> = React.memo(
  ({
    filteredTodos,
    handleDeleteTodo,
    isLoadingTodo,
    handleUpdateTodo,
    editingTodoId,
    setEditingTodoId,
  }) => {
    return (
      <section className="todoapp__main" data-cy="TodoList">
        {filteredTodos.map(todo => {
          return (
            <TodoItem
              key={todo.id}
              todo={todo}
              handleDeleteTodo={handleDeleteTodo}
              isLoadingTodo={isLoadingTodo}
              handleUpdateTodo={handleUpdateTodo}
              editingTodoId={editingTodoId}
              setEditingTodoId={setEditingTodoId}
            />
          );
        })}
      </section>
    );
  },
);

TodoList.displayName = 'TodoList';
