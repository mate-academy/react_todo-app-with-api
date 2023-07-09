/* eslint-disable consistent-return */
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import classNames from 'classnames';
import { TodoType } from '../../types/Todo';
import { Todo } from '../Todo/Todo';
import { useTodos } from '../../contexts/todosContext';

type TodoListProps = {
  todos: TodoType[];
};

export const TodoList = ({ todos }: TodoListProps) => {
  const { tempTodo, processedTodos } = useTodos();

  return (
    <section className="todoapp__main">
      <TransitionGroup>
        {[...todos, tempTodo].map((todo) => {
          if (!todo) {
            return;
          }

          return (
            <CSSTransition
              key={todo.id}
              timeout={300}
              classNames={classNames('item', {
                'temp-item': todo.id === 0,
              })}
            >
              <Todo
                isProcessed={processedTodos.some(({ id }) => id === todo.id)}
                key={todo.id}
                todo={todo}
              />
            </CSSTransition>
          );
        })}
      </TransitionGroup>
    </section>
  );
};
