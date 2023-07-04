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

      {/* i need this for next tasks */}

      {/* This todo is being edited
      <div className="todo">
        <label className="todo__status-label">
          <input
            type="checkbox"
            className="todo__status"
          />
        </label>

        This form is shown instead of the title and remove button
        <form>
          <input
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            value="Todo is being edited now"
          />
        </form>

        <div className="modal overlay">
          <div className="modal-background has-background-white-ter" />
          <div className="loader" />
        </div>
      </div>

      This todo is in loadind state
      <div className="todo">
        <label className="todo__status-label">
          <input type="checkbox" className="todo__status" />
        </label>

        <span className="todo__title">Todo is being saved now</span>
        <button type="button" className="todo__remove">×</button>

        'is-active' class puts this modal on top of the todo
        <div className="modal overlay is-active">
          <div className="modal-background has-background-white-ter" />
          <div className="loader" />
        </div>
      </div> */}

      {tempTodo && (
        <div className="todo">
          <label className="todo__status-label">
            <input type="checkbox" className="todo__status" />
          </label>

          <span className="todo__title">{tempTodo.title}</span>
          <button type="button" className="todo__remove">×</button>

          {/* 'is-active' class puts this modal on top of the todo */}
          <div className="modal overlay is-active">
            <div className="modal-background has-background-white-ter" />
            <div className="loader" />
          </div>
        </div>
      )}
    </section>
  );
};
