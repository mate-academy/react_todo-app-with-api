import { useContext } from 'react';
import { TodosContext } from '../../stor/Context';
import { TodoInfo } from '../TodoInfo/TodoInfo';
import { CSSTransition, TransitionGroup } from 'react-transition-group';

type Props = {};

export const Main: React.FC<Props> = () => {
  const { visibleTodos, tempTodo, loadingIds } = useContext(TodosContext);

  return (
    <section className="todoapp__main" data-cy="TodoList">
      <TransitionGroup>
        {visibleTodos.map(todo => (
          <CSSTransition key={todo.id} timeout={300} classNames="item">
            <TodoInfo todo={todo} isProcessed={loadingIds.includes(todo.id)} />
          </CSSTransition>
        ))}
        {tempTodo && (
          <CSSTransition key={0} timeout={300} classNames="temp-item">
            <TodoInfo todo={tempTodo} isProcessed />
          </CSSTransition>
        )}
      </TransitionGroup>
    </section>
  );
};
