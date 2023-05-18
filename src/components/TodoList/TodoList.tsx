import { TransitionGroup, CSSTransition } from 'react-transition-group';
import { useTodoContext } from '../../context/TodoContext';
import { Filter } from '../../types/Filter';
import { TodoItem } from '../TodoItem';

export const TodoList: React.FC = () => {
  const { todos, filter, tempTodo } = useTodoContext();

  const visibleTodos = todos.filter((todo) => {
    switch (filter) {
      case Filter.ACTIVE:
        return !todo.completed;

      case Filter.COMPLETED:
        return todo.completed;

      default:
        return true;
    }
  });

  return (
    <section className="todoapp__main">
      <TransitionGroup className="todo-list">
        {visibleTodos.map((todo) => (
          <CSSTransition key={todo.id} classNames="todo-item" timeout={300}>
            <TodoItem todo={todo} />
          </CSSTransition>
        ))}
      </TransitionGroup>
      {tempTodo && (
        <CSSTransition classNames="fade" timeout={300}>
          <TodoItem todo={tempTodo} isPermanentlyLoading />
        </CSSTransition>
      )}
    </section>
  );
};
