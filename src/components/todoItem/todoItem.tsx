// import { TodoInfo } from '../todoinfo/todoinfo';
import classNames from 'classnames';
import { useTodos } from '../../context/todoProvider';
import { Todo } from '../../types/Todo';
import { ErrorType } from '../../types/Error';
import { toggleStatus } from '../../api/todos';

type Props = {
  task: Todo;
  handleDeleteClick: (id: number) => void;
};

export const TodoItem = ({ task, handleDeleteClick }: Props) => {
  const {
    deletingTask, setError, todos, setTodos,
  } = useTodos();

  const toggleTodo = (id: number) => {
    const todo = todos.find(el => el.id === id);

    toggleStatus(id, { completed: !todo?.completed })
      .then((data) => {
        const updatedTodos = todos.map(el => (el.id === id ? data : el));

        setTodos(updatedTodos);
      })
      .catch(() => setError(ErrorType.update));
  };

  return (
    <div
      key={task.id}
      data-cy="Todo"
      className={classNames('todo', {
        completed: task.completed,
      })}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={task.completed}
          onClick={() => toggleTodo(task.id)}
        />
      </label>

      <span data-cy="TodoTitle" className="todo__title">
        {task.title}
      </span>

      <button
        type="button"
        className="todo__remove"
        data-cy="TodoDelete"
        onClick={() => handleDeleteClick(task.id)}
      >
        ×
      </button>

      {/* overlay will cover the todo while it is being updated */}
      <div
        data-cy="TodoLoader"
        className={classNames('modal overlay', {
          'is-active': deletingTask.includes(task.id),
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
// This todo is not completed
//   <div data-cy="Todo" className="todo">
//   <label className="todo__status-label">
//     <input
//       data-cy="TodoStatus"
//       type="checkbox"
//       className="todo__status"
//     />
//   </label>

//   <span data-cy="TodoTitle" className="todo__title">
//     Not Completed Todo
//   </span>
//   <button type="button" className="todo__remove" data-cy="TodoDelete">
//     ×
//   </button>

//   <div data-cy="TodoLoader" className="modal overlay">
//     <div className="modal-background has-background-white-ter" />
//     <div className="loader" />
//   </div>
// </div>

// This todo is being edited
// <div data-cy="Todo" className="todo">
//   <label className="todo__status-label">
//     <input
//       data-cy="TodoStatus"
//       type="checkbox"
//       className="todo__status"
//     />
//   </label>

// This form is shown instead of the title and remove button
//   <form>
//     <input
//       data-cy="TodoTitleField"
//       type="text"
//       className="todo__title-field"
//       placeholder="Empty todo will be deleted"
//       value="Todo is being edited now"
//     />
//   </form>

//   <div data-cy="TodoLoader" className="modal overlay">
//     <div className="modal-background has-background-white-ter" />
//     <div className="loader" />
//   </div>
// </div>

// This todo is in loadind state
// <div data-cy="Todo" className="todo">
//   <label className="todo__status-label">
//     <input
//       data-cy="TodoStatus"
//       type="checkbox"
//       className="todo__status"
//     />
//   </label>

//   <span data-cy="TodoTitle" className="todo__title">
//     Todo is being saved now
//   </span>

//   <button type="button" className="todo__remove" data-cy="TodoDelete">
//     ×
//   </button>

// 'is-active' class puts this modal on top of the todo
//   <div data-cy="TodoLoader" className="modal overlay is-active">
//     <div className="modal-background has-background-white-ter" />
//     <div className="loader" />
//   </div>
// </div>
