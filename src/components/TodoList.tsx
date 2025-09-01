import { useMemo, useState } from 'react';
import { Todo } from '../types/Todo';
import TodoItem from './TodoItem';
import { deleteTodo, USER_ID } from '../api/todos';
import { Errors } from '../types/Error';
import { Filters } from '../types/Filters';
import Footer from './Footer';
import { TransitionGroup, CSSTransition } from 'react-transition-group';

type Props = {
  todos: Todo[];
  tempTitle: string;
  handleDelete: (ids: number | number[]) => void;
  handleTodoError: (message: Errors) => void;
  onUpdateTodo: (data: Todo) => void;
  onSetLoading: (ids: number[]) => void;
  loadingIds: number[];
};

function TodoList({
  todos,
  tempTitle,
  handleDelete,
  handleTodoError,
  onUpdateTodo,
  onSetLoading,
  loadingIds,
}: Props) {
  const [filter, setFilter] = useState<Filters>(Filters.All);
  const filteredTodos = useMemo(() => {
    switch (filter) {
      case Filters.Active: {
        return todos.filter(todo => !todo.completed);
      }
      case Filters.Completed: {
        return todos.filter(todo => todo.completed);
      }
      case Filters.All:
      default:
        return todos;
    }
  }, [filter, todos]);
  const allCompleted = todos.some(todo => todo.completed);
  const activeTodos = useMemo(
    () => todos.filter(todo => !todo.completed).length,
    [todos],
  );
  const handleChangeFilter = (value: Filters) => {
    if (value !== filter) {
      setFilter(value);
    }
  };

  async function handleClearTodos() {
    const completedTodos = todos.filter(todo => todo.completed);
    onSetLoading(completedTodos.map(todo => todo.id));
    try {
      const res = await Promise.allSettled(
        completedTodos.map(todo => deleteTodo(todo.id)),
      );
      const successfulIndexes: number[] = res.reduce<number[]>(
        (acc, curr, ind) => {
          if (curr.status === 'fulfilled') {
            acc.push(completedTodos[ind].id);
          }
          return acc;
        },
        [],
      );
      handleDelete(successfulIndexes);
      onSetLoading([]);

      const isFailed = res.some(req => req.status === 'rejected');

      if (isFailed) {
        throw new Error(Errors.DeleteTodo);
      }
    } catch (error) {
      handleTodoError(Errors.DeleteTodo);
      onSetLoading([]);
    } finally {
    }
  }
  return (
    <>
      <section className="todoapp__main" data-cy="TodoList">
        {filteredTodos.length > 0 && (
          <TransitionGroup>
            {filteredTodos.map(todo => (
              <CSSTransition key={todo.id} timeout={300} classNames="item">
                <TodoItem
                  key={todo.id}
                  todo={todo}
                  onDelete={handleDelete}
                  onError={handleTodoError}
                  isPending={loadingIds.includes(todo.id)}
                  onUpdateTodo={onUpdateTodo}
                  onSetLoading={onSetLoading}
                />
              </CSSTransition>
            ))}
            {tempTitle && (
              <CSSTransition key={0} timeout={300} classNames="temp-item">
                <TodoItem
                  key={0}
                  todo={{
                    title: tempTitle,
                    completed: false,
                    id: 0,
                    userId: USER_ID,
                  }}
                  isPending={true}
                  onDelete={handleDelete}
                  onError={handleTodoError}
                  onUpdateTodo={onUpdateTodo}
                  onSetLoading={onSetLoading}
                />
              </CSSTransition>
            )}
          </TransitionGroup>
        )}
      </section>
      {todos.length > 0 && (
        <Footer
          activeTodosNum={activeTodos}
          filter={filter}
          allCompleted={allCompleted}
          onChangeFilter={handleChangeFilter}
          onClearTodos={handleClearTodos}
        />
      )}
    </>
  );
}

export default TodoList;
