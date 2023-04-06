import React from 'react';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { ChangeField, Todo } from '../types/Todo';
import { TodoComponent } from './TodoComponent';
import '../styles/transitions.scss';

type Props = {
  todos: Todo[],
  onDelete: (id: number) => void,
  onChange: (id: number, todoField: ChangeField) => void,
  tempTodo: Todo | null,
  todosInProcess: number[],
};

export const TodoList: React.FC<Props> = ({
  todos,
  onDelete,
  onChange,
  tempTodo,
  todosInProcess,
}) => {
  return (
    <section className="todoapp__main">
      <TransitionGroup>
        {
          todos.map((todo) => (
            <CSSTransition
              key={todo.id}
              timeout={300}
              classNames="item"
            >
              <TodoComponent
                todo={todo}
                onDelete={onDelete}
                onChange={onChange}
                isTodoLoading={todosInProcess.includes(todo.id)}
              />
            </CSSTransition>
          ))
        }
        {
          tempTodo !== null && (
            <CSSTransition
              timeout={300}
              classNames="temp-item"
            >
              <TodoComponent todo={tempTodo} />
            </CSSTransition>
          )
        }

      </TransitionGroup>
    </section>
  );
};
