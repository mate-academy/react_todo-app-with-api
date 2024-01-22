import { useContext } from 'react';
import { TodoItem } from '../TodoItem';
import { TodoContext } from '../TodoContext';
import { StateFilter } from '../../types/StateFilter';
import { Todo } from '../../types/Todo';

type Props = {
  onDeleteTodo: (todoId: number) => void;
  onChangeStatus: (todo: Todo) => void;
  usingUpdatesId: number[],
  setError: (message: string) => void;
  updateTodo: (
    todo: Todo,
    onSuccess?: () => void,
    onError?: () => void,
  ) => void;
};

export const TodoList: React.FC<Props> = ({
  onDeleteTodo,
  onChangeStatus,
  usingUpdatesId,
  updateTodo,
  setError,
}) => {
  const { todos, selectedState } = useContext(TodoContext);

  const filterTodos = () => {
    switch (selectedState) {
      case StateFilter.Active:
        return todos.filter((todo) => !todo.completed);
      case StateFilter.Completed:
        return todos.filter((todo) => todo.completed);
      case StateFilter.All:
      default:
        return todos;
    }
  };

  return (
    <section className="todoapp__main" data-cy="TodoList">
      {filterTodos().map(todo => (
        <TodoItem
          todo={todo}
          key={todo.id}
          todoDeleteButton={onDeleteTodo}
          onChangeStatus={onChangeStatus}
          usingUpdatesId={usingUpdatesId}
          updateTodo={updateTodo}
          setError={(message) => setError(message)}
        />
      ))}
    </section>
  );
};
