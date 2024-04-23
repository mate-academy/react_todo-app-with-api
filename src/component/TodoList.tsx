import { useContext } from 'react';
import { TodoItem } from './TodoItem';
import { TodosContext } from '../TodosProvider/TodosProvider';
import { useLocation } from 'react-router-dom';
import { CSSTransition, TransitionGroup } from 'react-transition-group';

export const TodoList: React.FC = () => {
  const { todos, filterTodos, tempTodo } = useContext(TodosContext);
  const location = useLocation();
  const filteredTodos = filterTodos(todos, location.hash);

  return (
    <section className="todoapp__main" data-cy="TodoList">
      <TransitionGroup>
        {filteredTodos.map(todo => (
          <CSSTransition key={todo.id} timeout={1000} classNames="item">
            <TodoItem key={todo.id} todo={todo} />
          </CSSTransition>
        ))}
        {tempTodo && (
          <CSSTransition key={0} timeout={1000} classNames="temp-item">
            <TodoItem key={tempTodo.id} todo={tempTodo} />
          </CSSTransition>
        )}
      </TransitionGroup>
    </section>
  );
};
