import React from 'react';
import { Todo } from '../types/Todo';
import { TempTodo } from '../types/TempTodo';
import { TodoItem } from './TodoItem';

type Props = {
  todos: Todo[];
  tempTodo: TempTodo | null;
  tempTodoId: number;
  loadingTodoIds: number[];
  editingTodoId: number | null;
  editingTitle: string;
  onToggleTodo: (todo: Todo) => void;
  onDeleteTodo: (todoId: number) => void;
  onStartEditing: (todo: Todo | TempTodo) => void;
  onEditingTitleChange: (title: string) => void;
  onCancelEditing: () => void;
  onSubmitTodoTitle: (todo: Todo) => void;
};

export const TodoList: React.FC<Props> = ({
  todos,
  tempTodo,
  tempTodoId,
  loadingTodoIds,
  editingTodoId,
  editingTitle,
  onToggleTodo,
  onDeleteTodo,
  onStartEditing,
  onEditingTitleChange,
  onCancelEditing,
  onSubmitTodoTitle,
}) => {
  const todosToRender = tempTodo ? [...todos, tempTodo] : todos;

  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todosToRender.map(todo => {
        const isTemp = todo.id === tempTodoId;
        const isLoading = isTemp || loadingTodoIds.includes(todo.id);

        return (
          <TodoItem
            key={todo.id || 'temp-todo'}
            todo={todo}
            isTemp={isTemp}
            isLoading={isLoading}
            isEditing={editingTodoId === todo.id}
            editingTitle={editingTitle}
            onToggle={onToggleTodo}
            onDelete={onDeleteTodo}
            onStartEditing={onStartEditing}
            onEditingTitleChange={onEditingTitleChange}
            onCancelEditing={onCancelEditing}
            onSubmitTitle={onSubmitTodoTitle}
          />
        );
      })}
    </section>
  );
};
