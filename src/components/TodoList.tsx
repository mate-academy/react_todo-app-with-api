import React, { useState } from 'react';
import { Todo } from '../types/Todo';
import { TodoItem } from './TodoItem';

type Props = {
  filteredTodos: Todo[];
  loadingIds: number[];
  onDeleteTodo: (todoId: number) => Promise<void>;
  tempTodo: Todo | null;
  onUpdateTodo: (todoToUpdate: Todo) => Promise<void>;
};

export const TodoList: React.FC<Props> = props => {
  const { filteredTodos, loadingIds, onDeleteTodo, tempTodo, onUpdateTodo } =
    props;

  const [editedTodoId, setEditedTodoId] = useState<number | null>(null);

  return (
    <section className="todoapp__main" data-cy="TodoList">
      {filteredTodos.map(todo => (
        <TodoItem
          key={todo.id}
          todo={todo}
          onDeleteTodo={onDeleteTodo}
          isLoading={loadingIds.includes(todo.id)}
          onUpdateTodo={onUpdateTodo}
          isInEditingProcess={editedTodoId === todo.id}
          setEditedTodoId={setEditedTodoId}
        />
      ))}
      {tempTodo && (
        <TodoItem
          todo={tempTodo}
          onDeleteTodo={onDeleteTodo}
          isLoading
          onUpdateTodo={onUpdateTodo}
          setEditedTodoId={setEditedTodoId}
        />
      )}
    </section>
  );
};
