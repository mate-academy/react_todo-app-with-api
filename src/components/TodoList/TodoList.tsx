import { useAppSelector } from '../../app/hooks';
import { Status } from '../../types/Status';
import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem/TodoItem';
import { CSSTransition, TransitionGroup } from 'react-transition-group';

export const TodoList: React.FC = () => {
  const todos = useAppSelector(state => state.todos.items);
  const status = useAppSelector(state => state.todos.status);
  const tempTodo = useAppSelector(state => state.todos.tempTodo);

  const getList = (sortType: Status): Todo[] => {
    switch (sortType) {
      case Status.active:
        return todos.filter(todo => !todo.completed);
      case Status.completed:
        return todos.filter(todo => todo.completed);
      case Status.all:
        return todos;
    }
  };

  return (
    <section className="todoapp__main" data-cy="TodoList">
      <TransitionGroup>
        {getList(status).map(todo => (
          <CSSTransition key={todo.id} timeout={300} classNames="item">
            <TodoItem key={todo.id} todo={todo} />
          </CSSTransition>
        ))}
        {tempTodo && (
          <CSSTransition key={0} timeout={300} classNames="temp-item">
            <TodoItem key={tempTodo.id} todo={tempTodo} />
          </CSSTransition>
        )}
      </TransitionGroup>
    </section>
  );
};
