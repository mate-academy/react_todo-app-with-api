import React from 'react';
import cn from 'classnames';
import { Todo } from '../../types/Todo';

interface Props {
  todos: Todo[],
  handleDeleteTodo: (todo: number) => void;
  handleComplitedTodo: (todoId: number, toggle: boolean) => void;
  disableInput: boolean;
  editingTodosId: number[];
  formShowedForId: number;
  showForm: (todoId: number) => void;
}

export const TodoList: React.FC<Props> = ({
  todos,
  handleDeleteTodo,
  handleComplitedTodo,
  disableInput,
  editingTodosId,
  formShowedForId,
  showForm,
}) => {
  return (
    <section className="todoapp__main">

      {todos.map(todo => {
        return todo.completed
          ? (
            <div className="todo completed" key={todo.id}>
              <label className="todo__status-label">

                <input
                  type="checkbox"
                  className="todo__status"
                  defaultChecked={todo.completed}
                  onClick={() => handleComplitedTodo(todo.id, true)}
                />

              </label>

              {formShowedForId === todo.id
                ? (
                  <form>
                    <input
                      type="text"
                      className="todo__title-field"
                      placeholder="Empty todo will be deleted"
                      value="Todo is being edited now"
                    />
                  </form>
                ) : (
                  <>
                    <span
                      className="todo__title"
                      onDoubleClick={() => showForm(todo.id)}
                    >
                      {todo.title}
                    </span>

                    <button
                      type="button"
                      className="todo__remove"
                      onClick={() => handleDeleteTodo(todo.id)}
                    >
                      ×
                    </button>
                  </>

                )}

              <div className={cn('modal', 'overlay', {
                'is-active': disableInput && editingTodosId.includes(todo.id),
              })}
              >
                <div className="modal-background has-background-white-ter" />
                <div className="loader" />
              </div>
            </div>
          ) : (
            <div className="todo" key={todo.id}>
              <label className="todo__status-label">

                <input
                  type="checkbox"
                  className="todo__status"
                  defaultChecked={todo.completed}
                  onClick={() => handleComplitedTodo(todo.id, false)}
                />

              </label>

              {formShowedForId === todo.id
                ? (
                  <form>
                    <input
                      type="text"
                      className="todo__title-field"
                      placeholder="Empty todo will be deleted"
                    />
                  </form>
                ) : (
                  <>
                    <span
                      className="todo__title"
                      onDoubleClick={() => showForm(todo.id)}
                    >
                      {todo.title}
                    </span>

                    <button
                      type="button"
                      className="todo__remove"
                      onClick={() => handleDeleteTodo(todo.id)}
                    >
                      ×
                    </button>
                  </>
                )}

              <div className={cn('modal', 'overlay', {
                'is-active': disableInput && editingTodosId.includes(todo.id),
              })}
              >
                <div className="modal-background has-background-white-ter" />
                <div className="loader" />
              </div>
            </div>
          );
      })}

    </section>
  );
};

// {/* This todo is being edited */}
// <div className="todo">
//   <label className="todo__status-label">
//     <input
//       type="checkbox"
//       className="todo__status"
//     />
//   </label>

//   {/* This form is shown instead of the title and remove button */}
//   <form>
//     <input
//       type="text"
//       className="todo__title-field"
//       placeholder="Empty todo will be deleted"
//       value="Todo is being edited now"
//     />
//   </form>

//   <div className="modal overlay">
//     <div className="modal-background has-background-white-ter" />
//     <div className="loader" />
//   </div>
// </div>

// {/* This todo is in loadind state */}
// <div className="todo">
//   <label className="todo__status-label">
//     <input type="checkbox" className="todo__status" />
//   </label>

//   <span className="todo__title">Todo is being saved now</span>
//   <button type="button" className="todo__remove">×</button>

//   {/* 'is-active' class puts this modal on top of the todo */}
//   <div className="modal overlay is-active">
//     <div className="modal-background has-background-white-ter" />
//     <div className="loader" />
//   </div>
// </div>
