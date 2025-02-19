import React from 'react';
import { Todo } from '../../types/Todo';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { TodoItem } from '../TodoItem/TodoItem';

type Props = {
  tempTodo: Todo | null;
  todos: Todo[];
  setTodos: (value: Todo[]) => void;
  filteredTodos: Todo[];
  handleUpdate: (title: string, id: number, completed: boolean) => void;
  handleDelete: (id: number) => void;
  isSubmiting: boolean;
  loader: number;
  setLoader: (value: number) => void;
  handleErrorMessage: (value: string) => void;
  loaderAll: boolean;
};
export const TodoList: React.FC<Props> = ({
  tempTodo,
  todos,
  setTodos,
  filteredTodos,
  handleUpdate,
  handleDelete,
  isSubmiting,
  loader,
  setLoader,
  handleErrorMessage,
  loaderAll,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      <TransitionGroup>
        {(!tempTodo ? filteredTodos : [...filteredTodos, tempTodo]).map(
          todo => (
            <CSSTransition key={todo.id} timeout={300} classNames="item">
              <TodoItem
                todo={todo}
                todos={todos}
                setTodos={setTodos}
                handleUpdate={handleUpdate}
                handleDelete={handleDelete}
                isSubmiting={isSubmiting}
                loader={loader}
                setLoader={setLoader}
                handleErrorMessage={handleErrorMessage}
                loaderAll={loaderAll}
              />
            </CSSTransition>
          ),
        )}
      </TransitionGroup>
    </section>
  );
};
