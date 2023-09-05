import { TransitionGroup, CSSTransition } from 'react-transition-group';
import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem/TodoItem';

interface Props {
  visibaleTodos: Todo[],
  deleteTodo: (todoId: number) => void,
  tempTodo: Todo | null,
  patchTodo: (todoId: number, patch: object) => void,
  processedTodos: number[],
}

export const TodoList: React.FC<Props> = ({
  visibaleTodos,
  deleteTodo = () => { },
  tempTodo,
  patchTodo,
  processedTodos,
}) => {
  return (
    <section className="todoapp__main">
      <TransitionGroup>
        {visibaleTodos.map(todo => (
          <CSSTransition
            key={todo.id}
            timeout={300}
            classNames="temp-item"
          >
            <TodoItem
              todo={todo}
              onDeleteTodo={deleteTodo}
              patchTodo={patchTodo}
              isProcesed={processedTodos.includes(todo.id)}
            />
          </CSSTransition>

        ))}

        {tempTodo !== null && (
          <CSSTransition
            key={0}
            timeout={300}
            classNames="temp-item"
          >
            <TodoItem todo={tempTodo} isProcesed />
          </CSSTransition>
        )}
      </TransitionGroup>

    </section>
  );
};
