import React from 'react';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { Todo } from '../../../types/Todo';
import { TodoItem } from '../TodoItem';

interface Props {
  todos: Todo[];
  tempTodo: Todo | null;
  removeTodo: (id: number) => void;
  loadingTodos: number[];
  setLoadingTodos: (removedId: number[]) => void;
  toggleTodoStatus: (id: number, completed: boolean) => void;
  todoRenaming: (id: number, title: string) => void;
}

export const TodoList: React.FC<Props> = ({
  todos,
  tempTodo,
  removeTodo,
  loadingTodos,
  setLoadingTodos,
  toggleTodoStatus,
  todoRenaming,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      <TransitionGroup>

        {todos.map(({
          id,
          title,
          completed,
        }) => {
          return (
            <CSSTransition
              key={id}
              timeout={300}
              classNames="item"
            >
              <TodoItem
                key={id}
                id={id}
                title={title}
                completed={completed}
                removeTodo={removeTodo}
                isAdding={false}
                loadingTodos={loadingTodos}
                setLoadingTodos={setLoadingTodos}
                toggleTodoStatus={toggleTodoStatus}
                todoRenaming={todoRenaming}
              />
            </CSSTransition>
          );
        })}
        {tempTodo && (
          <CSSTransition
            key={0}
            timeout={300}
            classNames="temp-item"
          >
            <TodoItem
              id={tempTodo.id}
              title={tempTodo.title}
              completed={tempTodo.completed}
              removeTodo={removeTodo}
              isAdding
              loadingTodos={loadingTodos}
              setLoadingTodos={setLoadingTodos}
              toggleTodoStatus={toggleTodoStatus}
              todoRenaming={todoRenaming}
            />
          </CSSTransition>
        )}
      </TransitionGroup>
    </section>
  );
};
