import { useContext } from 'react';

import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { TodoItem } from '../TodoItem/TodoItem';
import { TodoContext } from '../../contexts/TodoContext';
import { getFilteredTodos } from '../../helpers/getFilteredTodos';

export const TodoList: React.FC = () => {
  const { todos, filter, tempTodo } = useContext(TodoContext);

  const filteredTodos = getFilteredTodos(todos, filter);

  return (
    <section className="todoapp__main" data-cy="TodoList">
      <TransitionGroup>
        {filteredTodos.map(todo => (
          <CSSTransition key={todo.id} timeout={300} classNames="item">
            <TodoItem todo={todo} />
          </CSSTransition>
        ))}

        {tempTodo && (
          <CSSTransition key={0} timeout={300} classNames="temp-item">
            <TodoItem todo={tempTodo} />
          </CSSTransition>
        )}
      </TransitionGroup>
    </section>
  );
};
