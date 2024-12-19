/* eslint-disable jsx-a11y/label-has-associated-control */
import { Todo } from '../../types/types';
import { TempTodo } from '../TempTodo/TempTodo';
import { TodoItem } from '../TodoItem/TodoItem';

type Props = {
  filteredTodos: Todo[];
  deleteTodo: (value: number) => void;
  deletingId: number | null;
  tempTodo: Todo | null;
  updateTodo: (todo: Todo) => void;
  updatingId: number | null;
  inputRef: React.RefObject<HTMLInputElement>;
  updatingIds: number[];
};

export const TodoList: React.FC<Props> = ({
  filteredTodos,
  deleteTodo,
  deletingId,
  tempTodo,
  updateTodo,
  updatingId,
  inputRef,
  updatingIds,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {filteredTodos.map(todo => (
        <TodoItem
          key={todo.id}
          todo={todo}
          deleteTodo={deleteTodo}
          deletingId={deletingId}
          updateTodo={updateTodo}
          updatingId={updatingId}
          inputRef={inputRef}
          updatingIds={updatingIds}
        />
      ))}

      {tempTodo && <TempTodo tempTodo={tempTodo} />}
    </section>
  );
};
