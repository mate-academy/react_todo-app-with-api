import React from 'react';
import { Todo } from '../types/Todo';
import TodoItem from './TodoItem';

type Props = {
  todos: Todo[];
  setToodos: React.Dispatch<React.SetStateAction<Todo[]>>;
  setErrorMessage(val: string): void;
  setIsSubmitting(val: boolean): void;
  tempTodo: Todo | null;
  setLoader: React.Dispatch<React.SetStateAction<Record<number, boolean>>>;
  loader: Record<number, boolean>;
  handlerUpdateTodo: (todo: Todo) => Promise<void>;
};

const TodoList: React.FC<Props> = ({
  todos,
  tempTodo,
  setToodos,
  setErrorMessage,
  setIsSubmitting,
  setLoader,
  loader,
  handlerUpdateTodo,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map((todo) => (
        <TodoItem
          loader={loader}
          key={todo.id}
          todo={todo}
          setToodos={setToodos}
          setErrorMessage={setErrorMessage}
          setIsSubmitting={setIsSubmitting}
          setLoader={setLoader}
          handlerUpdateTodo={handlerUpdateTodo}
        />
      ))}
      {tempTodo && (
        <TodoItem
          todo={tempTodo}
          setToodos={setToodos}
          setErrorMessage={setErrorMessage}
          setIsSubmitting={setIsSubmitting}
          loader={loader}
          setLoader={setLoader}
          fakeTodoActive
        />
      )}
    </section>
  );
};

export default TodoList;
