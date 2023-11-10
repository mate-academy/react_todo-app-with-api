import { Todo } from '../../types/Todo';

import { TodoSelecet } from '../TodoSelect/TodoSelect';

/*eslint-disable*/

type Props = {
  onDeleteCompletedTodos: (value: Todo[]) => void,
  onTodoSelected: (value: string) => void,

  isTodoSelected: string,
  completedTodos: Todo[],
  todosCounter: number,
};

export const TodoFooter: React.FC<Props> = ({
  onDeleteCompletedTodos,
  onTodoSelected,

  isTodoSelected,
  completedTodos,
  todosCounter,
}) => {
  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {`${todosCounter} items left`}
      </span>

      <TodoSelecet
        onTodoSelected={onTodoSelected}
        isTodoSelected={isTodoSelected}
      />

        <button
          disabled={completedTodos.length === 0}
          type="button"
          className="todoapp__clear-completed"
          data-cy="ClearCompletedButton"
          onClick={() => onDeleteCompletedTodos(completedTodos)}
        >
          Clear completed
        </button>
    </footer>
  );
};
