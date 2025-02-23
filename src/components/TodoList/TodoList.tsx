import React from 'react';
import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem/TodoItem';
import { Footer } from '../Footer';
import { Filter } from '../../types/Filter';

interface Props {
  todosFromServer: Todo[];
  displayedTodos: Todo[];
  loadingTodosIds: number[];
  filter: Filter;
  setFilter: (value: Filter) => void;
  activeTodosCount: number;
  areThereCompletedTodos: boolean;
  handleDelete: (id: number) => Promise<void>;
  handleClearCompleted: (todos: Todo[]) => void;
  handleEditTodo: (todoId: number, data: Todo) => Promise<void>;
  newTodoInput: React.RefObject<HTMLInputElement>;
}

export const TodoList: React.FC<Props> = ({
  todosFromServer,
  displayedTodos,
  loadingTodosIds,
  filter,
  setFilter,
  activeTodosCount,
  areThereCompletedTodos,
  handleDelete,
  handleClearCompleted,
  handleEditTodo,
  newTodoInput,
}) => (
  <>
    <section className="todoapp__main" data-cy="TodoList">
      {displayedTodos.map(todo => (
        <TodoItem
          todo={todo}
          isLoading={loadingTodosIds.includes(todo.id)}
          handleDelete={handleDelete}
          key={todo.id}
          handleEditTodo={handleEditTodo}
          newTodoInput={newTodoInput}
        />
      ))}
    </section>

    <Footer
      activeTodosCount={activeTodosCount}
      areThereCompletedTodos={areThereCompletedTodos}
      filter={filter}
      setFilter={setFilter}
      todosFromServer={todosFromServer}
      handleClearCompleted={handleClearCompleted}
    />
  </>
);
