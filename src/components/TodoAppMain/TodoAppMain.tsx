import React from 'react';
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import { EditTodo, Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem';

type Props = {
  deletingIds: number[];
  updatingIds: number[];
  selectedUpdateTodo: number | null;
  editTodo: EditTodo | null;
  loadingIds: number[];
  loaderToggle: boolean;
  loaderDelete: boolean;
  todos: Todo[];
  tempTodo: Todo | null;
  loaderClearButton: boolean;
  onSelectedTodo: (todoId: number) => void;
  setToggleTodo: (todo: Todo) => void;
  setEditTodo: (todo: EditTodo) => void;
  setSelectedUpdateTodo: (id: number | null) => void;
};

export const TodoAppMain = React.memo<Props>(
  ({
    updatingIds,
    deletingIds,
    selectedUpdateTodo,
    setSelectedUpdateTodo,
    editTodo,
    setEditTodo,
    loadingIds,
    setToggleTodo,
    loaderClearButton,
    todos,
    tempTodo,
    onSelectedTodo,
  }) => {
    return (
      <section className="todoapp__main" data-cy="TodoList">
        <TransitionGroup>
          {todos.map(todo => (
            <CSSTransition key={todo.id} timeout={300} classNames="item">
              <TodoItem
                updatingIds={updatingIds}
                deletingIds={deletingIds}
                selectedUpdateTodo={selectedUpdateTodo}
                setSelectedUpdateTodo={setSelectedUpdateTodo}
                editTodo={editTodo}
                loadingIds={loadingIds}
                setToggleTodo={setToggleTodo}
                todo={todo}
                loaderClearButton={loaderClearButton}
                tempTodo={tempTodo}
                onSelectedTodo={onSelectedTodo}
                setEditTodo={setEditTodo}
              />
            </CSSTransition>
          ))}

          {tempTodo && (
            <CSSTransition key={0} timeout={300} classNames="temp-item">
              <TodoItem
                updatingIds={updatingIds}
                deletingIds={deletingIds}
                selectedUpdateTodo={selectedUpdateTodo}
                setSelectedUpdateTodo={setSelectedUpdateTodo}
                editTodo={editTodo}
                loadingIds={loadingIds}
                todo={tempTodo}
                loaderClearButton={false}
                tempTodo={tempTodo}
                onSelectedTodo={onSelectedTodo}
                setToggleTodo={setToggleTodo}
                setEditTodo={setEditTodo}
              />
            </CSSTransition>
          )}
        </TransitionGroup>
      </section>
    );
  },
);

TodoAppMain.displayName = 'TodoAppMain';
