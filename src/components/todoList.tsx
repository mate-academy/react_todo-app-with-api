import * as React from 'react';
import { Todo } from '../types/Todo';
import { TodoItem } from './todoItem';

interface Props {
  visibleTodos: Todo[];
  tempTodo: Todo | null;
  isLoading: number[];
  onDelete: (id: number) => void;
  handleRename: (todo: Todo, newTitle: string) => void;
  editingId: number | null;
  setEditingId: (id: number | null) => void;
  updateTodoItem: (id: number, data: Partial<Todo>) => Promise<void | Todo>;
}

const TodoListComponent: React.FC<Props> = ({
  visibleTodos,
  tempTodo,
  isLoading,
  onDelete,
  handleRename,
  editingId,
  setEditingId,
  updateTodoItem,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {visibleTodos.map(todo => (
        <TodoItem
          key={todo.id}
          todo={todo}
          isLoading={isLoading.includes(todo.id)}
          onDelete={onDelete}
          handleRename={handleRename}
          editingId={editingId}
          setEditingId={setEditingId}
          updateTodoItem={updateTodoItem}
        />
      ))}

      {tempTodo && (
        <TodoItem
          todo={tempTodo}
          isLoading={true}
          editingId={editingId}
          setEditingId={setEditingId}
          handleRename={handleRename}
          onDelete={() => {}}
          updateTodoItem={updateTodoItem}
        />
      )}
    </section>
  );
};

export const TodoList = React.memo(TodoListComponent);
