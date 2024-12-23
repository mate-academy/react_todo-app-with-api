import React, { useState } from 'react';
import { TodoItem } from './TodoItem';
import { Todo } from '../types/Todo';

type Props = {
  filteredTodos: Todo[];
  loadingTodo: number[];
  onRemoveTodo: (todoId: number) => Promise<void>;
  onUpdateTodo: (todo: Todo) => Promise<void>;
  tempTodo: Todo | null;
};

export const TodoList: React.FC<Props> = props => {
  const { filteredTodos, onRemoveTodo, loadingTodo, onUpdateTodo, tempTodo } =
    props;

  const [editTodo, setEditTodo] = useState<null | number>(null);

  return (
    <section className="todoapp_main" data-cy="TodoList">
      {filteredTodos.map(todo => (
        <TodoItem
          key={todo.id}
          todo={todo}
          onRemoveTodo={onRemoveTodo}
          isLoading={loadingTodo.includes(todo.id)}
          onUpdateTodo={onUpdateTodo}
          isEditMode={editTodo === todo.id}
          setEditTodo={setEditTodo}
        />
      ))}

      {tempTodo && (
        <TodoItem
          todo={tempTodo}
          onRemoveTodo={onRemoveTodo}
          isLoading
          onUpdateTodo={onUpdateTodo}
          setEditTodo={setEditTodo}
        />
      )}
    </section>
  );
};
