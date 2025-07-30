import React from 'react';
import { Todo } from '../types/Todo';
import { FilterType } from '../types/FilterType';
import { TodoItem } from './TodoItem';
import { ErrorMessages } from '../types/ErrorMessages';

type Props = {
  todoList: Todo[];
  loadingTodoIds: number[];
  deleteTodo: (todoId: number) => void;
  currentFilter: FilterType;
  updateTodo: (todo: Todo) => void;
  setErrorMessage: (message: ErrorMessages) => void;
};

export const TodoList: React.FC<Props> = ({
  todoList,
  loadingTodoIds,
  deleteTodo,
  currentFilter,
  updateTodo,
  setErrorMessage,
}) => {
  const filteredTodos = todoList.filter(todo => {
    switch (currentFilter) {
      case FilterType.all:
        return true;

      case FilterType.active:
        return !todo.completed;

      case FilterType.completed:
        return todo.completed;
    }
  });

  return (
    <section className="todoapp__main" data-cy="TodoList">
      {filteredTodos.map((todo, i) => (
        <TodoItem
          key={todo.id + i}
          todo={todo}
          deleteTodo={deleteTodo}
          isLoading={loadingTodoIds.includes(todo.id)}
          updateTodo={newTodo => updateTodo(newTodo)}
          setErrorMessage={setErrorMessage}
        />
      ))}
    </section>
  );
};
