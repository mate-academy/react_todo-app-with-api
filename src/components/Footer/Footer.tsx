import React, { useContext } from 'react';
import classNames from 'classnames';
import { Filter } from '../../types/Filter';
import { Todo } from '../../types/Todo';
import { TodosContext } from '../../TodoContext/TodoProvider';
import { deleteTodo } from '../../api/todos';
import { TodoError } from '../../types/errors';

interface Props {
  todos: Todo[];
  filter: Filter;
  onFilter: (filter: Filter) => void;
  onRemove: (id: number) => void;
  onError: (err: string) => void;
}

export const Footer: React.FC<Props> = (props) => {
  const {
    todos, filter, onFilter, onRemove, onError,
  } = props;

  const isThereCompleted = todos.filter(todo => todo.completed).length > 0;
  const uncompletedCount = todos.filter(todo => !todo.completed).length;

  const { addTodoForUpdate, removeTodoForUpdate } = useContext(TodosContext);
  const todosForDelete = todos.filter(todo => todo.completed);

  const deleteAllCompleted = () => {
    todosForDelete.forEach(
      todo => {
        addTodoForUpdate(todo);
        deleteTodo(todo.id)
          .then(() => {
            removeTodoForUpdate(todo);
            onRemove(todo.id);
          })
          .catch(() => {
            onError(TodoError.DeleteTodo);
            removeTodoForUpdate(todo);
          });
      },
    );
  };

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {`${uncompletedCount} items left`}
      </span>

      <nav className="filter" data-cy="Filter">
        <a
          href="#/"
          className={classNames('filter__link', {
            selected: filter === Filter.All,
          })}
          data-cy="FilterLinkAll"
          onClick={() => onFilter(Filter.All)}
        >
          All
        </a>

        <a
          href="#/active"
          className={classNames('filter__link', {
            selected: filter === Filter.Active,
          })}
          data-cy="FilterLinkActive"
          onClick={() => onFilter(Filter.Active)}
        >
          Active
        </a>

        <a
          href="#/completed"
          className={classNames('filter__link', {
            selected: filter === Filter.Completed,
          })}
          data-cy="FilterLinkCompleted"
          onClick={() => onFilter(Filter.Completed)}
        >
          Completed
        </a>
      </nav>

      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        onClick={deleteAllCompleted}
        disabled={!isThereCompleted}
      >
        Clear completed
      </button>
    </footer>
  );
};
