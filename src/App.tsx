/* eslint-disable jsx-a11y/control-has-associated-label */
import React, {
  useContext, useEffect, useRef, useState,
} from 'react';
import { AuthContext } from './components/Auth/AuthContext';
import { TodoList } from './components/TodoList/TodoList';
import { getTodos, postTodo } from './api/todos';
import { Todo } from './types/Todo';

export const App: React.FC = () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const user = useContext(AuthContext);
  const newTodoField = useRef<HTMLInputElement>(null);
  const [inputValue, setInputValue] = useState('');
  const [todos, setTodos] = useState<Todo[]>([]);

  if (user) {
    getTodos(user.id).then(res => setTodos(res));
  }

  const handleSubmit = () => {
    if (user) {
      postTodo(user.id, inputValue).then(res => setTodos(
        res,
      ));
    }
  };

  useEffect(() => {
    // focus the element with `ref={newTodoField}`
    if (newTodoField.current) {
      newTodoField.current.focus();
    }
  }, []);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>
      <div className="todoapp__content">
        <header className="todoapp__header">
          <button
            className="todoapp__toggle-all active"
            data-cy="TiggleAllButton"
            type="button"
          />

          <form onSubmit={handleSubmit}>
            <input
              type="text"
              className="todoapp__new-todo"
              data-cy="NewTodoField"
              ref={newTodoField}
              placeholder="What needs to be done?"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
            />
          </form>
        </header>
        {user && <TodoList todos={todos} />}
      </div>
    </div>
    // <div className="todoapp">
    //   <h1 className="todoapp__title">todos</h1>
    //
    //   <div className="todoapp__content">
    //     <header className="todoapp__header">
    //       <button
    //         data-cy="ToggleAllButton"
    //         type="button"
    //         className="todoapp__toggle-all active"
    //       />
    //
    //       <form>
    //         <input
    //           data-cy="NewTodoField"
    //           type="text"
    //           ref={newTodoField}
    //           className="todoapp__new-todo"
    //           placeholder="What needs to be done?"
    //         />
    //       </form>
    //     </header>
    //
    //     <section className="todoapp__main" data-cy="TodoList">
    //       <div data-cy="TodoItem" className="todo completed">
    //         <label className="todo__status-label">
    //           <input
    //             data-cy="TodoStatus"
    //             type="checkbox"
    //             className="todo__status"
    //             defaultChecked
    //           />
    //         </label>
    //
    //         <span data-cy="TodoTitle" className="todo__title">HTML</span>
    //         <button
    //           type="button"
    //           className="todo__remove"
    //           data-cy="TodoDeleteButton"
    //         >
    //           ×
    //         </button>
    //
    //         <div data-cy="TodoLoader" className="modal overlay">
    //           <div className="modal-background has-background-white-ter" />
    //           <div className="loader" />
    //         </div>
    //       </div>
    //
    //       <div data-cy="TodoItem" className="todo">
    //         <label className="todo__status-label">
    //           <input
    //             data-cy="TodoStatus"
    //             type="checkbox"
    //             className="todo__status"
    //           />
    //         </label>
    //
    //         <span data-cy="TodoTitle" className="todo__title">CSS</span>
    //
    //         <button
    //           type="button"
    //           className="todo__remove"
    //           data-cy="TodoDeleteButton"
    //         >
    //           ×
    //         </button>
    //
    //         <div data-cy="TodoLoader" className="modal overlay">
    //           <div className="modal-background has-background-white-ter" />
    //           <div className="loader" />
    //         </div>
    //       </div>
    //
    //       <div data-cy="TodoItem" className="todo">
    //         <label className="todo__status-label">
    //           <input
    //             data-cy="TodoStatus"
    //             type="checkbox"
    //             className="todo__status"
    //           />
    //         </label>
    //
    //         <form>
    //           <input
    //             data-cy="TodoTitleField"
    //             type="text"
    //             className="todo__title-field"
    //             placeholder="Empty todo will be deleted"
    //             defaultValue="JS"
    //           />
    //         </form>
    //
    //         <div data-cy="TodoLoader" className="modal overlay">
    //           <div className="modal-background has-background-white-ter" />
    //           <div className="loader" />
    //         </div>
    //       </div>
    //
    //       <div data-cy="TodoItem" className="todo">
    //         <label className="todo__status-label">
    //           <input
    //             data-cy="TodoStatus"
    //             type="checkbox"
    //             className="todo__status"
    //           />
    //         </label>
    //
    //         <span data-cy="TodoTitle" className="todo__title">React</span>
    //         <button
    //           type="button"
    //           className="todo__remove"
    //           data-cy="TodoDeleteButton"
    //         >
    //           ×
    //         </button>
    //
    //         <div data-cy="TodoLoader" className="modal overlay">
    //           <div className="modal-background has-background-white-ter" />
    //           <div className="loader" />
    //         </div>
    //       </div>
    //
    //       <div data-cy="TodoItem" className="todo">
    //         <label className="todo__status-label">
    //           <input
    //             data-cy="TodoStatus"
    //             type="checkbox"
    //             className="todo__status"
    //           />
    //         </label>
    //
    //         <span data-cy="TodoTitle" className="todo__title">Redux</span>
    //         <button
    //           type="button"
    //           className="todo__remove"
    //           data-cy="TodoDeleteButton"
    //         >
    //           ×
    //         </button>
    //
    //         <div data-cy="TodoLoader" className="modal overlay is-active">
    //           <div className="modal-background has-background-white-ter" />
    //           <div className="loader" />
    //         </div>
    //       </div>
    //     </section>
    //
    //     <footer className="todoapp__footer" data-cy="Footer">
    //       <span className="todo-count" data-cy="todosCounter">
    //         4 items left
    //       </span>
    //
    //       <nav className="filter" data-cy="Filter">
    //         <a
    //           data-cy="FilterLinkAll"
    //           href="#/"
    //           className="filter__link selected"
    //         >
    //           All
    //         </a>
    //
    //         <a
    //           data-cy="FilterLinkActive"
    //           href="#/active"
    //           className="filter__link"
    //         >
    //           Active
    //         </a>
    //         <a
    //           data-cy="FilterLinkCompleted"
    //           href="#/completed"
    //           className="filter__link"
    //         >
    //           Completed
    //         </a>
    //       </nav>
    //
    //       <button
    //         data-cy="ClearCompletedButton"
    //         type="button"
    //         className="todoapp__clear-completed"
    //       >
    //         Clear completed
    //       </button>
    //     </footer>
    //   </div>
    //
    //   <div
    //     data-cy="ErrorNotification"
    //     className="notification is-danger is-light has-text-weight-normal"
    //   >
    //     <button
    //       data-cy="HideErrorButton"
    //       type="button"
    //       className="delete"
    //     />
    //
    //     Unable to add a todo
    //     <br />
    //     Unable to delete a todo
    //     <br />
    //     Unable to update a todo
    //   </div>
    // </div>
  );
};
