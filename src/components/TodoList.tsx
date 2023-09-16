/* eslint-disable */
import React from "react";
import { Todo } from "../types/Todo";
import { TodoItem } from "./ToDo";
import { TransitionGroup, CSSTransition } from 'react-transition-group';

type Props = {
  list: Todo[],
}

export const TodoList: React.FC<Props> = ({ list }) => {
  return (
    <section className="todoapp__main">
      <TransitionGroup>
        {list.map(todo =>
          (<CSSTransition
            key={todo.id}
            timeout={300}
            classNames="item"
          >
            <TodoItem todo={todo} />
          </CSSTransition>
        ))}
        {/* {creating && (
      <CSSTransition
        key={0}
        timeout={300}
        classNames="temp-item"
      >
        <TodoItem
          todo={}
          // isProcessed
        />
      </CSSTransition>
    )} */}
      </TransitionGroup>
    </section>
  )
}
