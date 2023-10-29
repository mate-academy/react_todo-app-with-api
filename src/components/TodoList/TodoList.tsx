import '../../styles/todo.scss';
// import { Todo } from '../../types/Todo';

import { Todo } from '../../types/Todo';
import { TodoRow } from '../TodoRow/TodoRow';

 type Props = {
   todos: Todo[],
   tempTodo: Todo | null,
   deleteTodoHandler: (userId: number) => void
   isLoading: number[]
   displayTodos: Todo[]
   updateStatusHandler: (todo: Todo) => void
   setTodos: (todos: Todo[]) => void
   toggleToCompleted: () => void
   setError: (error: string) => void

 };

export const TodoList: React.FC<Props> = (
  {
    displayTodos,
    tempTodo,
    deleteTodoHandler,
    isLoading,
    updateStatusHandler,
    setTodos,
    todos,
    toggleToCompleted,
    setError,

  },
) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {displayTodos.map(todo => (
        <TodoRow
          todo={todo}
          deleteTodoHandler={deleteTodoHandler}
          updateStatusHandler={updateStatusHandler}
          isLoading={isLoading}
          setTodos={setTodos}
          todos={todos}
          toggleToCompleted={toggleToCompleted}
          setError={setError}
        />
      ))}

      {tempTodo && (
        <div data-cy="Todo" className="todo">
          <label className="todo__status-label">
            <input
              data-cy="TodoStatus"
              type="checkbox"
              className="todo__status"
            />
          </label>

          <span data-cy="TodoTitle" className="todo__title">
            {tempTodo.title}
          </span>

          <button type="button" className="todo__remove" data-cy="TodoDelete">
            ×
          </button>

          {/* 'is-active' class puts this modal on top of the todo */}
          <div data-cy="TodoLoader" className="modal overlay is-active">
            <div className="modal-background has-background-white-ter" />
            <div className="loader" />
          </div>
        </div>
      )}

    </section>
  );
};
