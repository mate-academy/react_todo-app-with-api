import React from 'react';
import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem';

type Props = {
  todos: Todo[];
  selectedTodoId: number;
  setSelectedTodoId: (id: number) => void;
  handleDeleteButtonClick: (id: number) => void;
  loadingTodosIds: number[];
  toggleTodoStatus: (id: number) => void;
  updateTodoTitle: (todo: Todo) => void;
};

export const TodoList: React.FC<Props> = ({
  todos,
  selectedTodoId,
  setSelectedTodoId,
  handleDeleteButtonClick,
  loadingTodosIds,
  toggleTodoStatus,
  updateTodoTitle,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => (
        <TodoItem
          todo={todo}
          selectedTodoId={selectedTodoId}
          setSelectedTodoId={setSelectedTodoId}
          onDelete={handleDeleteButtonClick}
          loadingTodosIds={loadingTodosIds}
          toggleTodoStatus={toggleTodoStatus}
          updateTodoTitle={updateTodoTitle}
          key={todo.id}
        />
      ))}
    </section>
  );
};
