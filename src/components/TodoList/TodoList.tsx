import { Dispatch, SetStateAction } from 'react';
import {
  CSSTransition,
  TransitionGroup,
} from 'react-transition-group';
import { Todo } from '../../types/Todo';
import { TodoInfo } from '../TodoInfo/TodoInfo';
import { TempTodo } from '../TempTodo/TempTodo';

interface Props {
  visibleTodos: Todo[] | null,
  currentInput: string,
  isLoading: string,
  setErrorWithTimer: (message: string) => void;
  setIsLoading: Dispatch<SetStateAction<string>>,
  // setAllTodos: Dispatch<SetStateAction<Todo [] | null>>,
  loadUserTodos: () => void;
}

export const TodoList: React.FC<Props> = (props) => {
  const {
    isLoading,
    currentInput,
    visibleTodos,
    // setAllTodos,
    setIsLoading,
    setErrorWithTimer,
    loadUserTodos,
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
                // setAllTodos={setAllTodos}
                loadUserTodos={loadUserTodos}
              />
            </CSSTransition>
          ))}
          {(isLoading === 'Adding') && (
            <CSSTransition
              key={0}
              timeout={300}
              classNames="temp-item"
            >
              <TempTodo currentInput={currentInput} />
            </CSSTransition>
          )}
        </TransitionGroup>
      </section>

    </>
  );
};
