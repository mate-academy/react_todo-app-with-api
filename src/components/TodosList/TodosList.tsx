import { FC, memo } from 'react';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { Todo } from '../../types/Todo';
import { TodosListProps } from './TodosListProps';
import { TodoInfo } from '../TodoInfo/TodoInfo';
import '../../App.scss';

export const TodosList: FC<TodosListProps> = memo(({
  todos,
  tempTodo,
  removesTodo,
  loadingTodos,
  onTooglingTodo,
  changeTitle,
}) => (
  <section className="todoapp__main">
    <TransitionGroup>
      {todos.map((todo: Todo) => (
        <CSSTransition
          key={todo.id}
          timeout={300}
          classNames="item"
        >
          <TodoInfo
            todo={todo}
            removesTodo={removesTodo}
            loadingTodos={loadingTodos}
            onTooglingTodo={onTooglingTodo}
            changeTitle={changeTitle}
          />
        </CSSTransition>
      ))}

      {tempTodo && (
        <CSSTransition
          key={tempTodo.id}
          timeout={300}
          classNames="temp-item"
        >
          <TodoInfo
            todo={tempTodo}
            removesTodo={removesTodo}
            loadingTodos={loadingTodos}
            onTooglingTodo={onTooglingTodo}
            changeTitle={changeTitle}
          />
        </CSSTransition>
      )}
    </TransitionGroup>
  </section>
));
