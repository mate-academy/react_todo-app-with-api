import { FC, useContext } from 'react';
import {
  CSSTransition,
  TransitionGroup,
} from 'react-transition-group';
import { Todo } from '../../types/Todo';
import { TodoTask } from '../TodoTask';
import { TodoContext } from '../TodoProvider';

interface Props {
  preparedTodos: Todo[];
  tempTodo: Todo | null;
}

export const TodoList: FC<Props> = ({
  preparedTodos,
  tempTodo,
}) => {
  const { processing } = useContext(TodoContext);

  return (
    <section className="todoapp__main">
      <TransitionGroup>
        {preparedTodos.map(todo => (
          <CSSTransition
            key={todo.id}
            timeout={300}
            classNames="item"
          >
            <TodoTask
              key={todo.id}
              todo={todo}
              isLoading={processing.includes(todo.id)}
            />
          </CSSTransition>
        ))}

        {tempTodo && (
          <CSSTransition
            key={tempTodo.id}
            timeout={300}
            classNames="temp-item"
          >
            <TodoTask
              todo={tempTodo}
              isLoading={processing.includes(tempTodo.id)}
            />
          </CSSTransition>
        )}
      </TransitionGroup>
    </section>
  );
};
