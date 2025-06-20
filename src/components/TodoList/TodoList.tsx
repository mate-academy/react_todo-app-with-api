import React from 'react';
import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem';

interface Props {
  todos: Todo[] | null;
  onDeleteTodo: (todoId: number) => Promise<void>;
  onToggleTodoStatus: (todoId: number) => Promise<void>;
  processingTodoIds: number[];
  tempTodo: Todo | null;
  editingTodoId: number | null;
  setEditingTodoId: (id: number | null) => void;
  onRenameTodo: (id: number, title: string) => Promise<void>;
}

export const TodoList: React.FC<Props> = ({
  todos,
  onDeleteTodo,
  onToggleTodoStatus,
  processingTodoIds,
  tempTodo,
  editingTodoId,
  setEditingTodoId,
  onRenameTodo,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos?.map(todo => {
        const isProcessing = processingTodoIds.includes(todo.id);

        return (
          <TodoItem
            key={todo.id}
            todo={todo}
            onDeleteTodo={onDeleteTodo}
            onToggleTodoStatus={onToggleTodoStatus}
            isProcessing={isProcessing}
            isEditing={editingTodoId === todo.id}
            setEditingTodoId={setEditingTodoId}
            onRenameTodo={onRenameTodo}
          />
        );
      })}

      {tempTodo && (
        <TodoItem
          key={tempTodo.id}
          todo={tempTodo}
          onDeleteTodo={onDeleteTodo}
          onToggleTodoStatus={onToggleTodoStatus}
          isProcessing={true}
          isEditing={false}
          setEditingTodoId={setEditingTodoId}
          onRenameTodo={onRenameTodo}
        />
      )}
    </section>
  );
};
