import React from 'react';
import { FilterStatus, Todo } from '../types/Todo';
import { Filter } from './Filter';

type Props = {
  todos: Todo[];
  todoStatus: FilterStatus;
  setTodoStatus: (newTodoStatus: FilterStatus) => void;
  handleDeleteCompletedTodo: () => void;
};

// eslint-disable-next-line react/display-name
export const Footer: React.FC<Props> = React.memo(
  ({ todos, todoStatus, setTodoStatus, handleDeleteCompletedTodo }: Props) => {
    const notCompletedTodosCount = todos.filter(todo => !todo.completed).length;
    const isCompleted = todos.some(todo => todo.completed);

    return (
      <footer className="todoapp__footer" data-cy="Footer">
        <span className="todo-count" data-cy="TodosCounter">
          {notCompletedTodosCount} items left
        </span>

        <Filter todoStatus={todoStatus} setTodoStatus={setTodoStatus} />

        <button
          type="button"
          className="todoapp__clear-completed"
          data-cy="ClearCompletedButton"
          onClick={handleDeleteCompletedTodo}
          disabled={!isCompleted}
        >
          Clear completed
        </button>
      </footer>
    );
  },
);
