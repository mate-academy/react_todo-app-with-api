import { FilterBy } from '../../types/FilterBy';
import { Todo } from '../../types/Todo';
import { TodosFilter } from '../TodosFilter/TodosFilter';
import { deleteTodo } from '../../api/todos';

type Props = {
  numberOfNotCompleted: number;
  filteredBy: FilterBy;
  setFilteredBy: (filterBy: FilterBy) => void;
  todos: Todo[];
  setTodos: (todos: Todo[]) => void;
  setErrorMessage: (arg: string) => void;
  setFocusedInput: (arg: boolean) => void;
};

export const Footer: React.FC<Props> = ({
  numberOfNotCompleted,
  filteredBy,
  setFilteredBy,
  todos,
  setTodos,
  setErrorMessage,
  setFocusedInput,
}) => {
  const handleClearCompleted = () => {
    setErrorMessage('');
    setFocusedInput(false);

    const completedTodos = todos.filter(todo => todo.completed);

    const deletePromises = completedTodos.map(todo => {
      return deleteTodo(todo.id)
        .then(() => ({ id: todo.id, success: true }))
        .catch(() => {
          setErrorMessage('Unable to delete a todo');

          return { id: todo.id, success: false };
        });
    });

    Promise.all(deletePromises)
      .then(results => {
        const successIds = results
          .filter(result => result.success)
          .map(result => result.id);

        setTodos(todos.filter(todo => !successIds.includes(todo.id)
          || !completedTodos.some(
            completedTodo => completedTodo.id === todo.id,
          )));
      })
      .finally(() => setFocusedInput(true));
  };

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {`${numberOfNotCompleted} items left`}
      </span>

      <TodosFilter
        filteredBy={filteredBy}
        setFilteredBy={setFilteredBy}
      />

      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        onClick={handleClearCompleted}
        disabled={todos.length === numberOfNotCompleted}
      >
        Clear completed
      </button>
    </footer>
  );
};
