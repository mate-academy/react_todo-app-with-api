import { FC } from 'react';
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import { TodoInfo } from '../TodoInfo';
import { Todo } from '../../types/Todo';

interface Props {
  todos: Todo[];
  loadingTodos: number[];
  tempTodo: Todo | null;
  removeTodo: (todoId: number) => void;
  editTodo: (todoId: number, data: Partial<Todo>) => void;
}

export const TodoList: FC<Props> = ({
  todos,
  loadingTodos,
  tempTodo,
  removeTodo,
  editTodo,
}) => (
  <section className="todoapp__main">
    <TransitionGroup>
      {tempTodo && (
        <CSSTransition
          key={0}
          timeout={300}
          classNames="temp-item"
        >
          <TodoInfo
            todo={tempTodo}
            loadingTodos={loadingTodos}
            removeTodo={removeTodo}
            editTodo={editTodo}
          />
        </CSSTransition>
      )}

      {todos.map((todo) => (
        <CSSTransition
          key={todo.id}
          timeout={300}
          classNames="item"
        >
          <TodoInfo
            todo={todo}
            loadingTodos={loadingTodos}
            removeTodo={removeTodo}
            editTodo={editTodo}
          />
        </CSSTransition>
      ))}
    </TransitionGroup>
  </section>
);
