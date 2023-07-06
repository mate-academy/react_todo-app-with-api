// import { useState } from 'react';
import { Todo } from '../types/Todo';
import { TodoInfo } from './TodoInfo';

interface Props {
  todos: Todo[]
  tempTodo:null | Todo;
  setError: React.Dispatch<React.SetStateAction<string>>;
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>;
  loader: number[],
  setLoader: React.Dispatch<React.SetStateAction<number[]>>
}

export const Todos: React.FC<Props> = ({
  todos,
  tempTodo,
  setError,
  setTodos,
  loader,
  setLoader,
}) => {
  return (
    <section className="todoapp__main">
      {todos.map(todo => (
        <TodoInfo
          key={todo.id}
          setError={setError}
          setTodos={setTodos}
          loader={loader}
          setLoader={setLoader}
          todo={todo}
        />

      ))}

      {tempTodo && (
        <div className="todo">
          <label className="todo__status-label">
            <input type="checkbox" className="todo__status" />
          </label>

          <span className="todo__title">{tempTodo.title}</span>
          <button type="button" className="todo__remove">×</button>

          <div className="modal overlay is-active">
            <div className="modal-background has-background-white-ter" />
            <div className="loader" />
          </div>
        </div>
      )}
    </section>
  );
};
