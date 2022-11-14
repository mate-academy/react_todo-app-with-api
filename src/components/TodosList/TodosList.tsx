import { FC } from 'react';
import { Todo } from '../../types/Todo';
import { TodoInfo } from '../TodoInfo';

type Props = {
  todos: Todo[];
  onDeleteTodo: (id: number) => void;
  addingNewTodo: boolean;
  tempTodo: Todo;
  deletingCompletedTodos: boolean;
  onSetErrorMessage: (message: string) => void;
  getTodosFromApi: () => void;
};

export const TodosList: FC<Props> = ({
  todos,
  onDeleteTodo,
  addingNewTodo,
  tempTodo,
  deletingCompletedTodos,
  onSetErrorMessage,
  getTodosFromApi,
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
          onSetErrorMessage={onSetErrorMessage}
          getTodosFromApi={getTodosFromApi}
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
          onSetErrorMessage={onSetErrorMessage}
          getTodosFromApi={getTodosFromApi}
        />
      )}
    </section>
  );
};
