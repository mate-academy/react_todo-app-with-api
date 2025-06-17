import React from 'react';

import { Todo } from '../../types/Todo';
import { Filter } from '../../types/Filter';
import { TodoItem } from '../TodoItem';

type Props = {
  todos: Todo[];
  filterField: Filter;
  handleDeleteTodo: (todoId: number) => void;
  processingTodoIds: number[];
  handleToggleCompleted: (todoId: number) => void;
  handleRenameTodo: (todoId: number, newTitle: string) => void;
  inputRef: React.RefObject<HTMLInputElement>;
};

const getFilteredTodos = (todos: Todo[], filterField: Filter) => {
  switch (filterField) {
    case Filter.Active:
      return [...todos].filter(todo => !todo.completed);

    case Filter.Completed:
      return [...todos].filter(todo => todo.completed);
  }

  return [...todos];
};

export const TodoList: React.FC<Props> = ({
  todos,
  filterField,
  handleDeleteTodo,
  processingTodoIds,
  handleToggleCompleted,
  handleRenameTodo,
  inputRef,
}) => {
  const filteredTodos = getFilteredTodos(todos, filterField);

  return (
    <section className="todoapp__main" data-cy="TodoList">
      {filteredTodos.map(todo => {
        return (
          <TodoItem
            todo={todo}
            key={todo.id}
            handleDeleteTodo={handleDeleteTodo}
            isLoading={processingTodoIds.includes(todo.id)}
            handleToggleCompleted={handleToggleCompleted}
            handleRenameTodo={handleRenameTodo}
            inputRef={inputRef}
          />
        );
      })}
    </section>
  );
};
