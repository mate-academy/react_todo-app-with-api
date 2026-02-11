import React, { useRef } from 'react';
import { TodoItem } from '../TodoItem/TodoItem';
import { Todo } from '../../types/Todo';
import { CSSTransition, TransitionGroup } from 'react-transition-group';

type Props = {
  refInputAdd: HTMLInputElement | null;
  prepareTodos: () => Todo[];
  deletedId: number[];
  tempTodo: Todo | null;
  handleDelete: (id: number, el: HTMLInputElement | null) => Promise<number>;
  updateTodo: (todoId: number, updatePart: string | boolean) => Promise<void>;
};

export const TodoList: React.FC<Props> = ({
  refInputAdd,
  prepareTodos,
  handleDelete,
  deletedId,
  tempTodo,
  updateTodo,
}) => {
  const refs = useRef<Record<number, React.RefObject<HTMLDivElement>>>({});

  return (
    <section className="todoapp__main" data-cy="TodoList">
      <TransitionGroup>
        {prepareTodos().map(todo => {
          if (!refs.current[todo.id]) {
            refs.current[todo.id] = React.createRef<HTMLDivElement>();
          }

          const nodeRef = refs.current[todo.id];

          return (
            <CSSTransition
              key={todo.id}
              timeout={300}
              classNames="item"
              nodeRef={nodeRef}
            >
              <TodoItem
                key={todo.id}
                title={todo.title}
                completed={todo.completed}
                isLoading={false}
                deletedId={deletedId}
                id={todo.id}
                handleDelete={handleDelete}
                updateTodo={updateTodo}
                refInputAdd={refInputAdd}
                nodeRef={nodeRef}
              />
            </CSSTransition>
          );
        })}
        {!!tempTodo &&
          (() => {
            const tempNodeRef = React.createRef<HTMLDivElement>();

            return (
              <CSSTransition
                key={0}
                timeout={300}
                classNames="temp-item"
                nodeRef={tempNodeRef}
              >
                <TodoItem
                  id={Math.random()}
                  title={tempTodo.title}
                  completed={tempTodo.completed}
                  isLoading={true}
                  nodeRef={tempNodeRef}
                />
              </CSSTransition>
            );
          })()}
      </TransitionGroup>
    </section>
  );
};
