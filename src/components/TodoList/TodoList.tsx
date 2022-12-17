import { Dispatch, SetStateAction } from 'react';
import {
  CSSTransition,
  TransitionGroup,
} from 'react-transition-group';
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
      <section className="todoapp__main" data-cy="TodoList">
        <TransitionGroup>
          {visibleTodos?.map((todo: Todo) => (
            <CSSTransition
              key={todo.id}
              timeout={300}
              classNames="item"
            >
              <TodoInfo
                todo={todo}
                isLoading={isLoading}
                setIsLoading={setIsLoading}
                setErrorWithTimer={setErrorWithTimer}
                setAllTodos={setAllTodos}
              />
            </CSSTransition>
          ))}
          {(isLoading === 'Adding') && (
            <CSSTransition
              key={0}
              timeout={300}
              classNames="temp-item"
            >
              <div
                className="todo"
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
            </CSSTransition>
          )}
        </TransitionGroup>
      </section>

    </>
  );
};
