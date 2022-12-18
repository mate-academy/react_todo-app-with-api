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
  isLoading: number[],
  setErrorWithTimer: (message: string) => void;
  loadUserTodos: () => void;
}

export const TodoList: React.FC<Props> = (props) => {
  const {
    isLoading,
    currentInput,
    visibleTodos,
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
                setErrorWithTimer={setErrorWithTimer}
                loadUserTodos={loadUserTodos}
              />
            </CSSTransition>
          ))}
          {isLoading.includes(0) && (
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
