import {
  Dispatch, SetStateAction, useMemo,
} from 'react';
import { Status } from '../types/Status';
import { Todo } from '../types/Todo';
import { TodoItem } from './TodoItem';

type Props = {
  todos: Todo[],
  status: Status,
  setTodos: Dispatch<SetStateAction<Todo[]>>,
  setErrorMessage: Dispatch<SetStateAction<string>>,
};

export const TodoList: React.FC<Props> = ({
  todos, status, setTodos, setErrorMessage,
}) => {
  const visibleTodos = useMemo(() => {
    switch (status) {
      case Status.active:
        return todos.filter(todo => !todo.completed);
      case Status.completed:
        return todos.filter(todo => todo.completed);
      default:
        return todos;
    }
  }, [todos, status]);

  return (
    <div>
      {visibleTodos.map(todo => (
        <TodoItem
          todo={todo}
          key={todo.id}
          todos={todos}
          setTodos={setTodos}
          setErrorMessage={setErrorMessage}
        />
      ))}
    </div>
  );
};
