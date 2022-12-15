import { useContext } from 'react';
import {
  CSSTransition,
  TransitionGroup,
} from 'react-transition-group';

import { Todo } from '../../types/Todo';
import { AuthContext } from '../Auth/AuthContext';
import { TodoItem } from '../TodoItem';

type Props = {
  todos: Todo[],
  isAdding: boolean,
  curTitle: string,
  onRename: (todo: Todo, newTitle: string) => Promise<void>,
  onDelete: (id: number) => void,
  onChangeStatus: (todo: Todo) => void,
  loadingTodosIds: number[]
};

export const TodoList: React.FC<Props> = (props) => {
  const {
    todos,
    onDelete,
    onRename,
    onChangeStatus,
    loadingTodosIds,
    isAdding,
    curTitle,
  } = props;

  const user = useContext(AuthContext);

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
              onDelete={onDelete}
              onRename={onRename}
              onChangeStatus={onChangeStatus}
              isLoading={loadingTodosIds.includes(todo.id)}
            />
          </CSSTransition>
        ))}

        {isAdding && user && (
          <CSSTransition
            key={0}
            timeout={300}
            classNames="temp-item"
          >
            <TodoItem
              todo={{
                id: 0,
                title: curTitle,
                completed: false,
                userId: user?.id,
              }}
              onDelete={onDelete}
              onRename={onRename}
              onChangeStatus={onChangeStatus}
              isLoading
            />
          </CSSTransition>
        )}
      </TransitionGroup>
    </section>
  );
};
