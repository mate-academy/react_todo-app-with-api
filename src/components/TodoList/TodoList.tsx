import React from 'react';
import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem';

interface Props {
  todos: Todo[];
  onRemoveTodo: (todoId: number) => Promise<void>;
  loading: number[];
  tempTodo: Todo | null;
  handleToggleTodo: (todoId: number, completed: boolean) => Promise<void>;
  renamingId: number | null;
  setRenamingId: React.Dispatch<React.SetStateAction<number | null>>;
  handleRenameTodo: (todoId: number, title: string) => Promise<void>;
}

export const TodoList: React.FC<Props> = ({
  todos,
  onRemoveTodo,
  loading,
  tempTodo,
  handleToggleTodo,
  renamingId,
  setRenamingId,
  handleRenameTodo,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => (
        <TodoItem
          todo={todo}
          key={todo.id}
          onRemoveTodo={onRemoveTodo}
          loading={loading}
          handleToggleTodo={handleToggleTodo}
          renamingId={renamingId}
          setRenamingId={setRenamingId}
          handleRenameTodo={handleRenameTodo}
        />
      ))}

      {tempTodo && (
        <TodoItem
          todo={tempTodo}
          key={tempTodo.id}
          onRemoveTodo={onRemoveTodo}
          loading={[0]}
          handleToggleTodo={handleToggleTodo}
          renamingId={renamingId}
          setRenamingId={setRenamingId}
          handleRenameTodo={handleRenameTodo}
        />
      )}
    </section>
  );
};
