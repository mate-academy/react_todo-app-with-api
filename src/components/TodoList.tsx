import { Dispatch, FC } from 'react';

import { Status } from '../types/Status';
import { Todo } from '../types/Todo';
import { getFilteredTodos } from '../utils/getFilteredTodos';
import TodoItem from './TodoItem';

interface Props {
  todos: Todo[];
  selectedStatus: Status;
  tempTodo: Todo | null;
  onErrorMessage: (message: string) => void;
  setTodos: Dispatch<React.SetStateAction<Todo[]>>;
  setDeletingId: Dispatch<React.SetStateAction<number>>;
  deletingId: number;
  setUpdatingTodoId: Dispatch<React.SetStateAction<number>>;
  updatingTodoId: number;
}

const TodoList: FC<Props> = ({
  todos,
  selectedStatus,
  tempTodo,
  onErrorMessage,
  setTodos,
  setDeletingId,
  deletingId,
  setUpdatingTodoId,
  updatingTodoId,
}) => {
  const filteredTodos = getFilteredTodos(todos, selectedStatus);

  const onTodoChange = (updatedTodo: Todo) =>
    setTodos((prevState: Todo[]) =>
      prevState.map(todoItem =>
        todoItem.id === updatedTodo.id ? updatedTodo : todoItem,
      ),
    );

  return (
    <section className="todoapp__main" data-cy="TodoList">
      {filteredTodos.map(todo => (
        <TodoItem
          key={todo.id}
          todo={todo}
          onErrorMessage={onErrorMessage}
          setTodos={setTodos}
          setDeletingId={setDeletingId}
          deletingId={deletingId}
          setUpdatingTodoId={setUpdatingTodoId}
          updatingTodoId={updatingTodoId}
          onTodoChange={onTodoChange}
        />
      ))}
      {tempTodo && (
        <TodoItem
          key={tempTodo.id}
          todo={tempTodo}
          onErrorMessage={onErrorMessage}
          setTodos={setTodos}
          setDeletingId={setDeletingId}
          deletingId={deletingId}
          setUpdatingTodoId={setUpdatingTodoId}
          updatingTodoId={updatingTodoId}
          onTodoChange={onTodoChange}
        />
      )}
    </section>
  );
};

export default TodoList;
