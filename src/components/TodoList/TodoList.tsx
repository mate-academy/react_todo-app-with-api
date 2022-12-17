import { Dispatch, SetStateAction } from 'react';
import { Todo } from '../../types/Todo';
import { TodoInfo } from '../TodoInfo/TodoInfo';

interface Props {
  visibleTodos: Todo[] | null,
  currentInput: string,
  setErrorWithTimer: (message: string) => void;
  isLoading: string,
  setIsLoading: Dispatch<SetStateAction<string>>,
  setAllTodos: Dispatch<SetStateAction<Todo [] | null>>,
}

export const TodoList: React.FC<Props> = (props) => {
  const {
    visibleTodos,
    currentInput,
    setErrorWithTimer,
    isLoading,
    setIsLoading,
    setAllTodos,
  } = props;

  return (
    <>
      <section
        className="todoapp__main"
        data-cy="TodoList"
      >
        {visibleTodos?.map((todo: Todo) => (
          <TodoInfo
            key={todo.id}
            todo={todo}
            isLoading={isLoading}
            setIsLoading={setIsLoading}
            // setVisibleTodos={setVisibleTodos}
            setErrorWithTimer={setErrorWithTimer}
            setAllTodos={setAllTodos}
          />
        ))}
        {(isLoading === 'Adding') && (
          <div
            className="todo"
            key={0}
          >
            <div data-cy="TodoLoader" className="modal overlay is-active">
              <div className="modal-background has-background-white-ter" />
              <div className="loader" />
            </div>
            <label className="todo__status-label">
              <input
                data-cy="TodoStatus"
                type="checkbox"
                className="todo__status"
              />
            </label>

            <span data-cy="TodoTitle" className="todo__title">
              {currentInput}
            </span>

            <button
              type="button"
              className="todo__remove"
              data-cy="TodoDeleteButton"
            >
              ×
            </button>
          </div>
        )}

      </section>

    </>
  );
};
