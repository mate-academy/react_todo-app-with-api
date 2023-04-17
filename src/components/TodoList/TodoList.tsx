import {
  CSSTransition,
  TransitionGroup,
} from 'react-transition-group';

import { TodoInfo } from '../TodoInfo/TodoInfo';
import '../../styles/animations.scss';

import { Todo } from '../../types/Todo';

type Props = {
  todos: Todo[],
  tempTodo: Todo | null,
  tempTodos: Todo[],
  removeTodo: (id:number) => void;
  onHandleStatusTodo: (id:number, completed:boolean) => void;
  onHandleTitleTodo: (id:number, title:string) => void;
  updatingTodo: Todo | null,
};

export const TodoList: React.FC<Props> = ({
  todos,
  tempTodo,
  tempTodos,
  removeTodo,
  onHandleStatusTodo,
  onHandleTitleTodo,
  updatingTodo,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      <TransitionGroup>
        {todos.map(todo => (
          <CSSTransition
            key={todo.id}
            timeout={300}
            classNames="item"
          >
            <TodoInfo
              todo={todo}
              isLoading={tempTodos.some(item => todo.id === item.id)}
              updatingTodo={updatingTodo}
              removeTodo={removeTodo}
              onHandleStatusTodo={onHandleStatusTodo}
              onHandleTitleTodo={onHandleTitleTodo}
            />
          </CSSTransition>
        ))}

        {tempTodo && (
          <CSSTransition
            key={0}
            timeout={300}
            classNames="temp-item"
          >
            <TodoInfo
              todo={tempTodo}
              isLoading
              updatingTodo={updatingTodo}
              removeTodo={removeTodo}
              onHandleStatusTodo={onHandleStatusTodo}
              onHandleTitleTodo={onHandleTitleTodo}
            />
          </CSSTransition>
        )}
      </TransitionGroup>
    </section>
  );
};
