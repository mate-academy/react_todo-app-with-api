import React from 'react';
import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem/TodoItem';
import { UpdateTodo } from '../../types/UpdateTodo';

interface TodoListProps {
  isUpdatingTodo: boolean;
  visibleTodos: Todo[];
  deletedTodoId: Todo['id'];
  toggledTodoId: Todo['id'];
  updateTitle: string;
  tempTodo: Todo | null;
  onChangeDeletedTodoId: (deletedTodoId: Todo['id']) => void;
  onDeleteTodo: (todoId: Todo['id']) => void;
  onChangeTodo: ({ id, title, completed }: UpdateTodo) => Promise<void>;
  onToggledTodoId: (toggledTodoId: Todo['id']) => void;
  onUpdateTitle: (updateTitle: string) => void;
}

export const TodoList: React.FC<TodoListProps> = ({
  isUpdatingTodo,
  visibleTodos,
  deletedTodoId,
  toggledTodoId,
  updateTitle,
  onChangeDeletedTodoId,
  tempTodo,
  onDeleteTodo,
  onChangeTodo,
  onToggledTodoId,
  onUpdateTitle,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {visibleTodos?.map(todo => {
        return (
          <TodoItem
            key={todo.id}
            todo={todo}
            isUpdatingTodo={isUpdatingTodo}
            deletedTodoId={deletedTodoId}
            toggledTodoId={toggledTodoId}
            updateTitle={updateTitle}
            onChangeDeletedTodoId={onChangeDeletedTodoId}
            onDeleteTodo={onDeleteTodo}
            onChangeTodo={onChangeTodo}
            onToggledTodoId={onToggledTodoId}
            onUpdateTitle={onUpdateTitle}
          />
        );
      })}
      {tempTodo && (
        <TodoItem
          key="temp"
          todo={tempTodo}
          isUpdatingTodo={isUpdatingTodo}
          deletedTodoId={deletedTodoId}
          toggledTodoId={toggledTodoId}
          updateTitle={updateTitle}
          onChangeDeletedTodoId={onChangeDeletedTodoId}
          onDeleteTodo={onDeleteTodo}
          onChangeTodo={onChangeTodo}
          onToggledTodoId={onToggledTodoId}
          onUpdateTitle={onUpdateTitle}
        />
      )}
    </section>
  );
};
