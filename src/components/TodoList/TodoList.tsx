import { createRef, useRef } from 'react';
import type { RefObject } from 'react';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { Todo } from '../../types/Todo';
import { TodoItem } from '../Todo';

type Props = {
  todos: (Todo & { temp?: boolean })[];
  toggleStatus: (value: number) => void;
  deleteTodo: (value: number) => Promise<boolean>;
  pendingList: number[];
  renameTodo: (id: number, value: string) => Promise<boolean>;
};

export const TodoList: React.FC<Props> = ({
  todos,
  toggleStatus,
  deleteTodo,
  pendingList,
  renameTodo,
}) => {
  const nodeRefs = useRef(new Map<number, RefObject<HTMLDivElement>>());

  const getNodeRef = (id: number) => {
    const storedRef = nodeRefs.current.get(id);

    if (storedRef) {
      return storedRef;
    }

    const newRef = createRef<HTMLDivElement>();

    nodeRefs.current.set(id, newRef);

    return newRef;
  };

  return (
    <section className="todoapp__main" data-cy="TodoList">
      <TransitionGroup>
        {todos.map(todo => {
          const nodeRef = getNodeRef(todo.id);
          const isTemp = Boolean(todo.temp);

          return (
            <CSSTransition
              key={todo.id}
              nodeRef={nodeRef}
              timeout={300}
              classNames={isTemp ? 'temp-item' : 'item'}
              exit={!isTemp}
            >
              <TodoItem
                todo={todo}
                ref={nodeRef}
                toggleStatus={toggleStatus}
                deleteTodo={deleteTodo}
                pendingList={pendingList}
                renameTodo={renameTodo}
              />
            </CSSTransition>
          );
        })}
      </TransitionGroup>
    </section>
  );
};
