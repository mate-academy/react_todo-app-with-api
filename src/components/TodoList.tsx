/* eslint-disable jsx-a11y/control-has-associated-label */
import { ErrorTypes } from '../types/ErrorTypes';
import { Todo } from '../types/Todo';
import { User } from '../types/User';
import { TodoInfo } from './TodoInfo';

type Props = {
  visibleTodos: Todo[],
  loadTodos: () => void,
  isAdding: boolean,
  title: string,
  user: User | null,
  addTodoToLoadingList: (idToAdd: number) => void,
  deleteTodoOfLoadingList: (idToAdd: number) => void,
  loadingList: number[],
  errorInfo: (errorTitle: ErrorTypes) => void,
};

export const TodoList: React.FC<Props> = (
  {
    visibleTodos,
    loadTodos,
    isAdding,
    title,
    user,
    addTodoToLoadingList,
    deleteTodoOfLoadingList,
    loadingList,
    errorInfo,
  },
) => {
  const previewTodo: Todo = {
    id: 0,
    userId: user?.id || 0,
    title,
    completed: false,
  };

  return (
    <section className="todoapp__main" data-cy="TodoList">
      {visibleTodos.map(todo => (
        <TodoInfo
          key={todo.id}
          todo={todo}
          loadTodos={loadTodos}
          errorInfo={errorInfo}
          addTodoToLoadingList={addTodoToLoadingList}
          deleteTodoOfLoadingList={deleteTodoOfLoadingList}
          loadingList={loadingList}
        />
      ))}
      {isAdding && (
        <div
          data-cy="Todo"
          className="todo"
        >
          <label className="todo__status-label">
            <input
              data-cy="TodoStatus"
              type="checkbox"
              className="todo__status"
            />
          </label>

          <span data-cy="TodoTitle" className="todo__title">
            {previewTodo.title}
          </span>
          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDeleteButton"
          >
            ×
          </button>

          <div
            data-cy="TodoLoader"
            className="modal overlay is-active todo__title-field"
          >
            <div
              className="modal-background has-background-white-ter"
            />
            <div className="loader" />
          </div>
        </div>
      )}
    </section>
  );
};
