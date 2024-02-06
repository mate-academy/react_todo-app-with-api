import {
  Dispatch, SetStateAction,
} from 'react';
import { TodoItem } from './TodoItem';
import { Todo } from '../types/Todo';
import { ErrorTypes } from '../types/ErrorTypes';

type Props = {
  todos: Todo[],
  setTodos: Dispatch<SetStateAction<Todo[]>>,
  tempTodo: Todo | null,
  setError: Dispatch<SetStateAction<ErrorTypes | null>>,
  inputRefAdd: React.Ref<HTMLInputElement>
};

export const TodoList:React.FC<Props> = ({
  todos, setTodos, tempTodo, setError, inputRefAdd,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map((todo, index) => (
        <TodoItem
          index={index}
          setTodos={setTodos}
          todo={todo}
          id={todo.id}
          key={todo.id}
          setError={setError}
          todos={todos}
          inputRefAdd={inputRefAdd}
        />
      ))}
      {tempTodo && (
        <TodoItem
          inputRefAdd={inputRefAdd}
          todos={todos}
          setTodos={setTodos}
          todo={tempTodo}
          tempTodo={tempTodo}
          id={tempTodo.id}
          setError={setError}
        />
      )}
    </section>
  );
};
