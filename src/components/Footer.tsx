import React from 'react';
import { Todo } from '../types/Todo';
import { Filter } from './Filter';
import { TodoStatus } from '../types/TodoStatus';

type Props = {
  todos: Todo[],
  onChangeSelect: (event: TodoStatus) => void,
  selectedOption: string,
  onHandleDeleteAll: () => void,
};

export const Footer: React.FC<Props> = ({
  todos,
  onChangeSelect = () => {},
  selectedOption,
  onHandleDeleteAll,
}) => {
  const activeTodosAmoun = todos
    .filter((todo) => !todo.completed).length;

  const isCompletedTodo = !!todos.some((todo) => todo.completed);

  return (
    <footer
      className="todoapp__footer"
      data-cy="Footer"
    >
      <span
        className="todo-count"
        data-cy="TodosCounter"
      >
        {`${activeTodosAmoun} items left`}
      </span>

      <Filter
        onChangeSelect={onChangeSelect}
        selectedOption={selectedOption}
      />

      <button
        type="button"
        disabled={!isCompletedTodo}
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        onClick={onHandleDeleteAll}
      >
        Clear completed
      </button>
    </footer>
  );
};
