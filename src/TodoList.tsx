import React from 'react';
import { Todo } from './types/Todo';
import { Status } from './types/status';
import { TodoItem } from './TodoItem';

interface TodoListProps {
  todosByStatus: (query?: Status) => Todo[];
  queryStatus: Status;
  deleteTodo: (id: number) => void;
  loadingIds: number[];
  tempTodo: Todo | null;
  selectedTodo: Todo | null;
  updateTodo: (todo: Todo) => void;
  handleTitle: (id: number, newTitle: string) => void;
  escapeKeyHandler: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  doubleClick: (todo: Todo) => void;
}

export const TodoList: React.FC<TodoListProps> = ({
  queryStatus,
  todosByStatus,
  deleteTodo,
  loadingIds,
  tempTodo,
  selectedTodo,
  updateTodo,
  handleTitle,
  escapeKeyHandler,
  doubleClick,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todosByStatus(queryStatus)?.map(todo => (
        <TodoItem
          key={todo.id}
          todo={todo}
          deleteTodo={deleteTodo}
          loadingIds={loadingIds}
          selectedTodo={selectedTodo}
          updateTodo={updateTodo}
          handleTitle={handleTitle}
          escapeKeyHandler={escapeKeyHandler}
          doubleClick={doubleClick}
        />
      ))}
      {tempTodo && (
        <TodoItem
          todo={tempTodo}
          deleteTodo={() => {}}
          loadingIds={loadingIds}
          selectedTodo={null}
          updateTodo={() => {}}
          handleTitle={() => {}}
          escapeKeyHandler={() => {}}
          doubleClick={() => {}}
        />
      )}
    </section>
  );
};
