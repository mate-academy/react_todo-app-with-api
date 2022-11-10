import { Dispatch, FC, SetStateAction } from 'react';
import { Todo } from '../../types/Todo';
import { TodoInfo } from '../TodoInfo';

type Props = {
  todos: Todo[];
  onDeleteTodo: (id: number) => void;
  addingNewTodo: boolean;
  tempTodo: Todo;
  deletingCompletedTodos: boolean;
  increaseCounter: () => void;
  setUpdatingError: Dispatch<SetStateAction<boolean>>;
};

export const TodosList: FC<Props> = ({
  todos,
  onDeleteTodo,
  addingNewTodo,
  tempTodo,
  deletingCompletedTodos,
  increaseCounter,
  setUpdatingError,
}) => {
  const {
    id, userId, title, completed,
  } = tempTodo;

  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => (
        <TodoInfo
          todo={todo}
          key={todo.id}
          onDeleteTodo={onDeleteTodo}
          addingNewTodo={false}
          deletingCompletedTodos={deletingCompletedTodos}
          increaseCounter={increaseCounter}
          setUpdatingError={setUpdatingError}
        />
      ))}
      {addingNewTodo && (
        <TodoInfo
          todo={{
            id,
            userId,
            title,
            completed,
          }}
          onDeleteTodo={onDeleteTodo}
          addingNewTodo={addingNewTodo}
          deletingCompletedTodos={deletingCompletedTodos}
          increaseCounter={increaseCounter}
          setUpdatingError={setUpdatingError}
        />
      )}
    </section>
  );
};
