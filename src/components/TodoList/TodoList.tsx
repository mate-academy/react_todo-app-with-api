import { Dispatch, FC, SetStateAction } from 'react';
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import { TodoInfo } from '../TodoInfo/TodoInfo';
import { Todo } from '../../types/Todo';
import { Errors } from '../../utils/enums';

interface Props {
  todos: Todo[];
  tempTodo: Todo | null;
  setTodos: Dispatch<SetStateAction<Todo[]>>;
  onError:(error: Errors) => void;
  onUpdate:(Todo: Todo) => void;
  isChanging: boolean;
}

export const TodoList: FC<Props> = ({
  todos,
  tempTodo,
  setTodos,
  onError,
  onUpdate,
  isChanging,
}) => (
  <section className="todoapp__main">
    <TransitionGroup>
      {todos.map((todo) => (
        <CSSTransition
          key={todo.id}
          timeout={300}
          classNames="item"
        >
          <TodoInfo
            todo={todo}
            key={todo.id}
            setTodos={setTodos}
            onError={onError}
            onUpdate={onUpdate}
            isChanging={isChanging}
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
            setTodos={setTodos}
            onError={onError}
            onUpdate={onUpdate}
            tempTodoId={tempTodo.id}
            isChanging={isChanging}
          />
        </CSSTransition>
      )}
    </TransitionGroup>
  </section>
);
