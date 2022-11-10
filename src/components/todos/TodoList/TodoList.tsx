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

        {todos.map((todo) => {
          return (
            <CSSTransition
              key={todo.id}
              timeout={300}
              classNames="item"
            >
              <TodoItem
                key={todo.id}
                todo={todo}
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
              todo={tempTodo}
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
