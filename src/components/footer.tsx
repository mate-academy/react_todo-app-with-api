import { FC, memo, useContext } from 'react';
import { DeleteContext } from '../contexts/DeleteContext';
import { GlobalContext } from '../contexts/GlobalContext';
import { Filter } from './Filter';

export const Footer: FC = memo(
  () => {
    const {
      visibleTodos,
      filterStatus,
      setFilterStatus,
      todos,
    } = useContext(GlobalContext);

    const {
      onClearCompleted,
      isClearCompletedHidden,
    } = useContext(DeleteContext);

    if (todos.length === 0) {
      return <></>;
    }

    const unFinishedTasks = visibleTodos.reduce((acc, task) => {
      return task.completed
        ? acc
        : acc + 1;
    }, 0);

    return (
      <footer
        className="todoapp__footer"
        data-cy="Footer"
      >
        <span className="todo-count" data-cy="todosCounter">
          {`${unFinishedTasks} items left`}
        </span>

        <Filter filterStatus={filterStatus} onFilter={setFilterStatus} />

        <button
          data-cy="ClearCompletedButton"
          type="button"
          className="todoapp__clear-completed"
          onClick={onClearCompleted}
          style={{
            visibility: !isClearCompletedHidden ? 'hidden' : 'visible',
          }}
        >
          Clear completed
        </button>
      </footer>
    );
  },
);
