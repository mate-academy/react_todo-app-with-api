import React, { FC, useContext, useRef } from 'react';
import { Todo } from '../../../types/Todo';
import { TodoItem } from '../TodoItem/TodoItem';
import { TodosContext } from '../../../context/TodoContext';
import { CSSTransition, TransitionGroup } from 'react-transition-group';

interface TodoListProps {
  todos: Todo[];
}

export const TodoList: FC<TodoListProps> = ({ todos }) => {
  const { tempTodo } = useContext(TodosContext);

  const refs = useRef<Record<number, React.RefObject<HTMLDivElement>>>({});

  todos.forEach(todo => {
    if (!refs.current[todo.id]) {
      refs.current[todo.id] = React.createRef();
    }
  });

  if (tempTodo && !refs.current[tempTodo.id]) {
    refs.current[tempTodo.id] = React.createRef();
  }

  return (
    <section className="todoapp__main" data-cy="TodoList">
      <TransitionGroup>
        {todos.map(todo => (
          <CSSTransition
            key={todo.id}
            timeout={300}
            classNames="item"
            nodeRef={refs.current[todo.id]}
          >
            <TodoItem ref={refs.current[todo.id]} key={todo.id} todo={todo} />
          </CSSTransition>
        ))}
        {tempTodo && (
          <CSSTransition
            key={tempTodo.id}
            timeout={300}
            classNames="temp-item"
            nodeRef={refs.current[tempTodo.id]}
          >
            <TodoItem
              ref={refs.current[tempTodo.id]}
              todo={tempTodo}
              isLoading={true}
            />
          </CSSTransition>
        )}
      </TransitionGroup>
    </section>
  );
};
