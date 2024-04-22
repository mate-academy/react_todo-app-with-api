/* eslint-disable jsx-a11y/label-has-associated-control */
import { useContext } from 'react';
import { TodoItem } from './TodoItem';
import { TodosContext } from '../TodosProvider/TodosProvider';
import { useLocation } from 'react-router-dom';
import { CSSTransition, TransitionGroup } from 'react-transition-group';

export const TodoList: React.FC = () => {
  const { todos, filterTodos, tempTodo } = useContext(TodosContext);
  const location = useLocation();
  const filteredTodos = filterTodos(todos, location.hash);

  return (
    <section className="todoapp__main" data-cy="TodoList">
      {/* This is a completed todo */}
      {/* <div data-cy="Todo" className="todo completed">
        <label className="todo__status-label">
          <input
            data-cy="TodoStatus"
            type="checkbox"
            className="todo__status"
            checked
          />
        </label>

        <span data-cy="TodoTitle" className="todo__title">
          Completed Todo
        </span> */}

      {/* Remove button appears only on hover */}
      {/* <button
          type="button"
          className="todo__remove"
          data-cy="TodoDelete"
        >
          ×
        </button> */}

      {/* overlay will cover the todo while it is being deleted or updated */}
      {/* <div data-cy="TodoLoader" className="modal overlay">
          <div className="modal-background has-background-white-ter" />
          <div className="loader" />
        </div>
      </div> */}

      {/* This todo is an active todo */}
      <TransitionGroup>
        {filteredTodos.map(todo => (
          <CSSTransition key={todo.id} timeout={1000} classNames="item">
            <TodoItem key={todo.id} todo={todo} />
          </CSSTransition>
        ))}
        {tempTodo && (
          <CSSTransition key={0} timeout={1000} classNames="temp-item">
            <TodoItem key={tempTodo.id} todo={tempTodo} />
          </CSSTransition>
        )}
        {/* This todo is being edited */}
        {/* <div data-cy="Todo" className="todo">
        <label className="todo__status-label">
          <input
            data-cy="TodoStatus"
            type="checkbox"
            className="todo__status"
          />
        </label> */}

        {/* This form is shown instead of the title and remove button */}
        {/* <form>
          <input
            data-cy="TodoTitleField"
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            value="Todo is being edited now"
          />
        </form>

        <div data-cy="TodoLoader" className="modal overlay">
          <div className="modal-background has-background-white-ter" />
          <div className="loader" />
        </div>
      </div> */}

        {/* This todo is in loadind state */}
        {/* <div data-cy="Todo" className="todo">
        <label className="todo__status-label">
          <input
            data-cy="TodoStatus"
            type="checkbox"
            className="todo__status"
          />
        </label>

        <span data-cy="TodoTitle" className="todo__title">
          Todo is being saved now
        </span>

        <button
          type="button"
          className="todo__remove"
          data-cy="TodoDelete"
        >
          ×
        </button> */}

        {/* 'is-active' class puts this modal on top of the todo */}
        {/* <div data-cy="TodoLoader" className="modal overlay is-active">
          <div className="modal-background has-background-white-ter" />
          <div className="loader" />
        </div>
      </div> */}
      </TransitionGroup>
    </section>
  );
};
