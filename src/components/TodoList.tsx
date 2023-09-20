/* eslint-disable */
import React from "react";
import { Todo } from "../types/Todo";
import { TodoItem } from "./ToDo";
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import classNames from "classnames";

type Props = {
  list: Todo[],
  newTodo: Todo | null,
}
export const TodoList: React.FC<Props> = ({ list, newTodo }) => {
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
          )
        )}
        {newTodo && (
          <CSSTransition
            key={0}
            timeout={300}
            classNames="temp-item"
          >
            <div className={classNames('todo', {
              completed: newTodo.completed,
            })}
            >
              <label className="todo__status-label">
                <input
                  type="checkbox"
                  className="todo__status"
                />
              </label>
              <div className="modal overlay is-active">
                <div className="modal-background has-background-white-ter" />
                <div className="loader" />
              </div>
              <span className="todo__title">{newTodo.title}</span>
              <button
                type="button"
                className="todo__remove"
              >
                ×
              </button>

              <div className="modal overlay">
                <div className="modal-background has-background-white-ter" />
                <div className="loader" />
              </div>
            </div>
          </CSSTransition>
        )}
      </TransitionGroup>
    </section>
  )
}
