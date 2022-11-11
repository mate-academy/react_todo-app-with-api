import React, { useEffect, useState } from 'react';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { Todo } from '../../types/Todo';
import { TodoStatus } from '../../types/TodoStatus';
import { InfoTodo } from '../InfoTodo';
import { FilterForTodo } from '../FilterForTodo';
import { deleteTodo } from '../../api/todos';
import '../../App.css';
// eslint-disable-next-line import/order
import classNames from 'classnames';

type Props = {
  todos: Todo[];
  handleLoadTodos: () => void;
  query: string;
  isEditing: boolean;
};

export const ListOfTodo: React.FC<Props> = ({
  todos,
  handleLoadTodos,
  query,
  isEditing,
}) => {
  const [filteredTodos, setFilteredTodos] = useState<Todo[]>([]);
  const [currentStatus, setTodosStatus] = useState<TodoStatus>(TodoStatus.ALL);

  const filterTodos = () => {
    let filtered;

    switch (currentStatus) {
      case TodoStatus.ACTIVE:
      case TodoStatus.COMPLETED:
        // eslint-disable-next-line max-len
        filtered = todos.filter((todo) => (currentStatus === TodoStatus.ACTIVE ? !todo.completed : todo.completed));
        break;
      default:
        filtered = todos;
    }

    return filtered;
  };

  useEffect(() => {
    setFilteredTodos(filterTodos());
  }, [currentStatus, filterTodos]);

  const handleChangeStatus = (status: TodoStatus) => {
    setTodosStatus(status);
  };

  // eslint-disable-next-line @typescript-eslint/no-shadow
  const handleDeleteAll = async (todos: Todo[]) => {
    // eslint-disable-next-line no-plusplus
    const fileredTodos = todos.filter((todo) => todo.completed);

    // eslint-disable-next-line no-plusplus
    await Promise.all(fileredTodos.map((todo) => deleteTodo(todo.id)));
  };

  const tempTodo = {
    id: 0,
    userId: 0,
    title: query,
    completed: false,
  };

  return (
    <>
      <section className="todoapp__main" data-cy="TodoList">
        <TransitionGroup>
          {filteredTodos.map((todo) => (
            // eslint-disable-next-line react/jsx-no-undef
            <CSSTransition key={todo.id} timeout={300} classNames="item">
              <InfoTodo
                todo={todo}
                key={todo.id}
                handleLoadTodos={handleLoadTodos}
              />
            </CSSTransition>
          ))}
          {isEditing && (
            <CSSTransition timeout={300} classNames="temp-item">
              <InfoTodo
                todo={tempTodo}
                handleLoadTodos={handleLoadTodos}
                isEditing={isEditing}
              />
            </CSSTransition>
          )}
        </TransitionGroup>
      </section>

      <footer className="todoapp__footer" data-cy="Footer">
        <span className="todo-count" data-cy="todosCounter">
          {todos.filter((todo) => todo.completed === false).length}
          {' '}
          items left
        </span>

        <FilterForTodo
          onChangeFilter={handleChangeStatus}
          status={currentStatus}
        />

        <TransitionGroup>
          <button
            data-cy="ClearCompletedButton"
            type="button"
            className={classNames('todoapp__clear-completed', {
              // eslint-disable-next-line max-len
              todoApp_hidden: !todos.find((todo) => Object.values(todo).includes(true)),
            })}
            onClick={async () => {
              await handleDeleteAll(todos);
              handleLoadTodos();
            }}
          >
            Clear completed
          </button>
        </TransitionGroup>
      </footer>
    </>
  );
};
