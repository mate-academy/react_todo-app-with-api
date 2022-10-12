import {
  CSSTransition,
  TransitionGroup,
} from 'react-transition-group';
import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem';
import './styles.css';

type Props = {
  todos: Todo[];
  tempTodo: Todo | {};
  deleteTodo: (id: number) => void;
  isDeleting: boolean;
  changeStatusTodo: (id: number) => void;
  tooggleIds: number[];
  updateTitle: (title: string, id: number) => void;
};

export const TodoList: React.FC<Props> = ({
  todos, tempTodo, deleteTodo, isDeleting,
  changeStatusTodo, tooggleIds, updateTitle,
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
            <TodoItem
              todo={todo}
              key={todo.id}
              deleteTodo={deleteTodo}
              isDeleting={isDeleting}
              changeStatusTodo={changeStatusTodo}
              tooggleIds={tooggleIds}
              updateTitle={updateTitle}
            />
          </CSSTransition>
        ))}

        {'id' in tempTodo && (
          <CSSTransition
            key={0}
            timeout={300}
            classNames="temp-item"
          >
            <TodoItem
              todo={tempTodo}
              key={tempTodo.id}
              deleteTodo={deleteTodo}
              changeStatusTodo={changeStatusTodo}
              isDeleting
              tooggleIds={tooggleIds}
              updateTitle={updateTitle}
            />
          </CSSTransition>

        )}
      </TransitionGroup>
    </section>
  );
};
