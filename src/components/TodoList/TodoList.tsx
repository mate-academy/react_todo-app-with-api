import React from 'react';
import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem/TodoItem';
import { TempTodoItem } from '../TempTodoItem/TempTodoItem';

type Props = {
  visibleData: Todo[];
  isLoadingSpinner: boolean;
  tempTodo: Omit<Todo, 'userId'> | null;
  onClickDeleteTodo: (todoId: number) => void;
  listTodoId: number[];
  onClickToggleCompleted: ({
    id,
    title,
    completed,
  }: Omit<Todo, 'userId'>) => void;
  onDoubleClickEditTodo: (todoId: number) => void;
  currentEditingTodoId: number | null;
  onSubmitUpdateTodo: ({ id, title, completed }: Omit<Todo, 'userId'>) => void;
};

export const TodoList: React.FC<Props> = ({
  visibleData,
  isLoadingSpinner,
  tempTodo,
  onClickDeleteTodo,
  listTodoId,
  onClickToggleCompleted,
  onDoubleClickEditTodo,
  currentEditingTodoId,
  onSubmitUpdateTodo,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {/* This is a completed todo */}
      {visibleData.map((todo: Todo) => {
        return (
          <TodoItem
            key={todo.id}
            todo={todo}
            onClickDeleteTodo={onClickDeleteTodo}
            listTodoId={listTodoId}
            onClickToggleCompleted={onClickToggleCompleted}
            onDoubleClickEditTodo={onDoubleClickEditTodo}
            currentEditingTodoId={currentEditingTodoId}
            onSubmitUpdateTodo={onSubmitUpdateTodo}
          />
        );
      })}
      {tempTodo && (
        <TempTodoItem tempTodo={tempTodo} isLoadingSpinner={isLoadingSpinner} />
      )}
    </section>
  );
};
