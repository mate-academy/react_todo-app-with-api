import React from 'react';
import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem/TodoItem';

type Props = {
  todos: Todo[];
  tempTodo: Todo | null;
  deleteTodo: (id: number) => void;
  isProcessing: Todo | null;
  onToggleCompleted: (todo: Todo) => void;
  isEditing: Todo | null;
  onEditTodo: (todo: Todo | null) => void;
  handleSaveTodo: (updatedTitle: string, todo: Todo) => void;
};

export const TodoList: React.FC<Props> = ({
  todos,
  tempTodo,
  deleteTodo,
  isProcessing,
  onToggleCompleted,
  isEditing,
  onEditTodo,
  handleSaveTodo,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map((todo) => (
        <TodoItem
          key={todo.id}
          todo={todo}
          deleteTodo={deleteTodo}
          isProcessing={isProcessing}
          onToggleCompleted={onToggleCompleted}
          isEditing={isEditing}
          onEditTodo={onEditTodo}
          handleSaveTodo={handleSaveTodo}
        />
      ))}

      {!!tempTodo && (
        <TodoItem
          key={tempTodo.id}
          todo={tempTodo}
          deleteTodo={() => {}}
          isProcessing={isProcessing}
          onToggleCompleted={onToggleCompleted}
          isEditing={isEditing}
          onEditTodo={onEditTodo}
          handleSaveTodo={handleSaveTodo}
        />
      )}
    </section>
  );
};
