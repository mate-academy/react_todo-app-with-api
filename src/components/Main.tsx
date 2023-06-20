/* eslint-disable */
import classNames from "classnames";
import React from "react";
import { Todo } from "../types/Todo";
import { RequestTodoBody } from "../types/RequestTodo";

import {
  CSSTransition,
  TransitionGroup,
} from 'react-transition-group';

type Props = {
  visibleTodos: Todo[];
  handlerUpdateTodoStatus: (todoId: number, currStatus: boolean) => Promise<void>;
  isEdit: number | null;
  setIsEdit: (value: number | null) => void;
  handlerUpdateTodoTitle: (todoId: number) => Promise<void>;
  editTitle: string;
  setEditTitle: (value: string) => void;
  handlerDeleteTodo: (todoId: number) => Promise<void>;
  waitForRequestTodoId: number | null;
  isWaitForRequestAll: boolean;
  tempTodo: RequestTodoBody | null
}

export const Main: React.FC<Props> = ({
  visibleTodos,
  handlerUpdateTodoStatus,
  isEdit,
  setIsEdit,
  handlerUpdateTodoTitle,
  editTitle,
  setEditTitle,
  handlerDeleteTodo,
  waitForRequestTodoId,
  isWaitForRequestAll,
  tempTodo,
}) => {
  return (
    <section className="todoapp__main">
      <TransitionGroup>
        {visibleTodos.map(todo => (
          <CSSTransition
          key={todo.id}
          timeout={300}
          classNames="item"
        >
          <div
            key={todo.id}
            className={classNames(
              'todo',
              { completed: todo.completed },
            )}
          >

          <label className="todo__status-label">
            <input
              type="checkbox"
              className="todo__status"
              onClick={() => handlerUpdateTodoStatus(todo.id, todo.completed)}
            />
          </label>

          {isEdit === todo.id
            ? (
              <form
                onSubmit={(event) => {
                  event.preventDefault();
                  handlerUpdateTodoTitle(todo.id);
                }}
              >
                <input
                  type="text"
                  className="todoapp__edit-todo disabled"
                  value={editTitle}
                  placeholder="Empty todo will delete"
                  onChange={event => {
                    setEditTitle(event.target.value);
                  }}
                  onBlur={() => {
                    setIsEdit(null);
                    if (!editTitle) {
                      handlerDeleteTodo(todo.id);
                    }
                  }}
                  onKeyDown={(event) => {
                    if (event.key === 'Escape') {
                      if (!editTitle) {
                        setIsEdit(null);
                        handlerDeleteTodo(todo.id);
                      }
                      setIsEdit(null);
                    }
                  }}
                  autoFocus
                />
              </form>
            ) : (
              <>
                <span
                  className="todo__title"
                  onDoubleClick={() => {
                    setIsEdit(todo.id);
                    setEditTitle(todo.title);
                  }}
                >
                  {todo.title}
                </span>
              </>
            )
          }

          <button
            type="button"
            className="todo__remove"
            onClick={() => handlerDeleteTodo(todo.id)}
          >
            ×
          </button>

          {(todo.id === waitForRequestTodoId || isWaitForRequestAll) && (
            <div className='modal overlay is-active'>
              <div className="modal-background has-background-white-ter" />
              <div className="loader" />
            </div>
          )}
        </div>
        </CSSTransition>
        ))}

        {tempTodo && (
          <CSSTransition
            key={0}
            timeout={300}
            classNames="temp-item"
          >
            <div className="todo">
            <label className="todo__status-label">
              <input
                type="checkbox"
                className="todo__status"
              />
            </label>

            <span className="todo__title">{tempTodo?.title}</span>

            <button
              type="button"
              className="todo__remove"
            >
              ×
            </button>

            <div className="modal overlay is-active">
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