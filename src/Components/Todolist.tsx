import {
  CSSTransition,
  TransitionGroup,
} from 'react-transition-group';
import { useEffect } from 'react';
import classNames from 'classnames';
import { Todo } from '../types/Todo';
import { TodoItem } from './TodoItem';

interface TodoListPropsType {
  todosToShow: Todo[],
  todoDelete: (todoId: number) => void,
  deletedId: number,
  tempTodo: Todo,
  added: boolean,
  updateTodo: (todoId: number, status: boolean | string, by: string) => void,
  updatedId: number | string,
  isLoading: boolean,
  setIsLoading: (isLoad: boolean) => void,
  editingId: number,
  setEditingId: (todoId: number) => void,
}

export const TodoList: React.FC<TodoListPropsType> = ({
  todosToShow,
  todoDelete,
  deletedId,
  tempTodo,
  added,
  updateTodo,
  updatedId,
  isLoading,
  setIsLoading,
  editingId,
  setEditingId,
}) => {
  useEffect(() => {
    todosToShow.push(tempTodo);
  }, [added]);

  return (
    <section className="todoapp__main">
      <TransitionGroup>
        {todosToShow.map(todo => (
          <CSSTransition
            key={todo.id}
            timeout={300}
            classNames={classNames(
              'item',
              { 'temp-item': todo.id === 0 },
            )}
          >
            <TodoItem
              todo={todo}
              deletedId={deletedId}
              todoDelete={todoDelete}
              updateTodo={updateTodo}
              updatedId={updatedId}
              isLoading={isLoading}
              setIsLoading={setIsLoading}
              editingId={editingId}
              setEditingId={setEditingId}
            />
          </CSSTransition>
        ))}
      </TransitionGroup>
    </section>
  );
};
