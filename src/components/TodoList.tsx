/* eslint-disable react/display-name */
import { Todo } from '../types/Todo';
import { TodoItem } from '../components';
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import { memo } from 'react';

interface Props {
  visibleTodos: Todo[];
  handleDeleteTodo: (todoId: number) => void;
  updateTodo: (todo: Todo) => Promise<void>;
  todosBeingProcessed: number[];
  setErrorMessage: (arg: string) => void;
  creating: boolean;
  inputValue: string;
}

export const TodoList: React.FC<Props> = memo(
  ({
    visibleTodos,
    handleDeleteTodo,
    updateTodo,
    todosBeingProcessed,
    setErrorMessage,
    creating,
    inputValue,
  }: Props) => {
    return (
      <TransitionGroup>
        {visibleTodos.map(todo => (
          <CSSTransition key={todo.id} timeout={300} classNames="item">
            <TodoItem
              todo={todo}
              handleDeleteTodo={handleDeleteTodo}
              updateTodo={updateTodo}
              todosBeingProcessed={todosBeingProcessed}
              setErrorMessage={setErrorMessage}
            />
          </CSSTransition>
        ))}
        {creating && (
          <CSSTransition key={0} timeout={300} classNames="temp-item">
            <TodoItem
              todo={{
                id: 0,
                title: inputValue,
                completed: false,
                userId: 2500,
              }}
            />
          </CSSTransition>
        )}
      </TransitionGroup>
    );
  },
);
