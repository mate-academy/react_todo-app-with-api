import { Dispatch, FC, SetStateAction } from 'react';
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import { TodoInfo } from '../TodoInfo/TodoInfo';
import { Todo } from '../../types/Todo';
import { Errors } from '../../utils/enums';

interface Props {
  todos: Todo[];
  tempTodo: Todo | null;
  setTodos: Dispatch<SetStateAction<Todo[]>>;
  setError:(error: Errors) => void;
  onUpdate:(Todo: Todo) => void;
  isChanging: boolean;
  setIsChanging: (boolean: boolean) => void;
}

export const TodoList: FC<Props> = ({
  todos,
  tempTodo,
  setTodos,
  setError,
  onUpdate,
  isChanging,
  setIsChanging,
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
            setError={setError}
            onUpdate={onUpdate}
            setIsChanging={setIsChanging}
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
            setError={setError}
            onUpdate={onUpdate}
            tempTodoId={tempTodo.id}
            setIsChanging={setIsChanging}
            isChanging={isChanging}
          />
        </CSSTransition>
      )}
    </TransitionGroup>
  </section>
);
