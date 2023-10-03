import React, { useContext } from 'react';
import classNames from 'classnames';
import { Navigation } from '../Navigation';
import { Filters } from '../../types/Filters';
import { TodoContext } from '../../utils/TodoContext';

type Props = {
  filterTodos: Filters
  setFilterTodos: (option: Filters) => void
};

export const Footer: React.FC<Props> = ({
  filterTodos,
  setFilterTodos,
}) => {
  const { todos, handleDelete } = useContext(TodoContext);

  const completedTodoCount = todos.some(todo => todo.completed);

  const itemsLeft = (): number => {
    const activeTasks = todos.filter((task) => !task.completed);

    return activeTasks.length;
  };

  const deleteTodo = () => {
    const todosToDelete = todos.filter(
      (todo) => todo.completed,
    );

    todosToDelete.forEach((todo) => {
      handleDelete(todo.id);
    });
  };

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {`${itemsLeft()} items left`}
      </span>

      <Navigation filterTodos={filterTodos} setFilterTodos={setFilterTodos} />

      <button
        type="button"
        className={classNames('todoapp__clear-completed', {
          'notification hidden': !completedTodoCount,
        })}
        data-cy="ClearCompletedButton"
        onClick={deleteTodo}
      >
        Clear completed
      </button>
    </footer>
  );
};
