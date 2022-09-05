import classNames from 'classnames';
import {
  useCallback,
  useEffect, useMemo,
  useRef,
  useState,
}
  from 'react';
import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';
import { Loader } from './Loader';

type Props = {
  todos: Todo[],
  selectedTodoId: number[]
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>,
  setSelectedTodoId: React.Dispatch<React.SetStateAction<number[]>>,
  isLoading: boolean,
  filterBy: string,
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>,
  setUnableUpdateTodo: React.Dispatch<React.SetStateAction<boolean>>,
  setunableDeleteTodo: React.Dispatch<React.SetStateAction<boolean>>,
};

export const TodosList: React.FC<Props> = (props) => {
  const {
    todos,
    selectedTodoId,
    setSelectedTodoId,
    setIsLoading,
    isLoading,
    filterBy,
    setTodos,
    setUnableUpdateTodo,
    setunableDeleteTodo,
  } = props;

  const [editTodo, setEditTodo] = useState(false);
  const [todoTitle, setTodoTitle] = useState('');

  const editTodoField = useRef<HTMLInputElement>(null);

  const updateTodoStatus = useCallback(
    (todoId: number, todoComleted: boolean) => {
      setIsLoading(true);
      setSelectedTodoId([todoId]);
      client.patch<Todo>(`/todos/${todoId}`, { completed: !todoComleted })
        .then(res => setTodos(prev => [...prev
          .slice(0, prev.findIndex(todo => todo.id === res.id)), res, ...prev
          .slice(prev.findIndex(todo => todo.id === res.id) + 1)]))
        .catch(() => setUnableUpdateTodo(true))
        .finally(() => setIsLoading(false));
    }, [selectedTodoId],
  );

  const deleteTodo = useCallback((todoId: number) => {
    setIsLoading(true);
    setSelectedTodoId([todoId]);
    client.delete(`/todos/${todoId}`)
      .then(res => {
        if (res === 1) {
          setTodos(prev => prev.filter(todo => todo.id !== todoId));
          setSelectedTodoId([]);
        }
      })
      .catch(() => setunableDeleteTodo(true))
      .finally(() => setIsLoading(false));
  }, [selectedTodoId]);

  const updateTodoTitle = useCallback((todoId: number) => {
    setSelectedTodoId([todoId]);
    setIsLoading(true);
    client.patch<Todo>(`/todos/${todoId}`, { title: todoTitle })
      .then(res => {
        setTodos(prev => [...prev.slice(0, prev
          .findIndex(todo => todo.id === res.id)), res, ...prev.slice(prev
          .findIndex(todo => todo.id === res.id) + 1)]);
      })
      .finally(() => setTimeout(() => setIsLoading(false), 500));
    setTodoTitle('');
    setEditTodo(false);
  }, [todoTitle]);

  useEffect(() => {
    // focus the element with `ref={newTodoField}`
    if (editTodo) {
      editTodoField.current?.focus();
    }
  }, [editTodo]);

  const visibleTodos = useMemo(() => {
    return todos.filter(todo => {
      switch (filterBy) {
        case 'active':
          return !todo.completed;
        case 'completed':
          return todo.completed;
        default:
          return todo;
      }
    });
  }, [filterBy, todos]);

  return (
    <section className="todoapp__main" data-cy="TodoList">
      {visibleTodos.map(todo => (
        <div
          data-cy="Todo"
          className={classNames('todo', { completed: todo.completed })}
          key={todo.id}
        >
          <label className="todo__status-label">
            <input
              data-cy="TodoStatus"
              type="checkbox"
              className="todo__status"
              onChange={() => updateTodoStatus(todo.id, todo.completed)}
            />
          </label>

          <span
            data-cy="TodoTitle"
            className="todo__title"
            onDoubleClick={() => {
              setSelectedTodoId([todo.id]);
              setTodoTitle(todo.title);
              setEditTodo(true);
            }}
          >
            {(editTodo && selectedTodoId.includes(todo.id))
              ? (
                <form onSubmit={(event) => {
                  event.preventDefault();
                  updateTodoTitle(todo.id);
                }}
                >
                  <input
                    type="text"
                    ref={editTodoField}
                    className="todoapp__edit-todo"
                    value={todoTitle}
                    onChange={
                      (event) => setTodoTitle(event.target.value)
                    }
                    onBlur={() => updateTodoTitle(todo.id)}
                  />
                </form>
              )
              : todo.title}
          </span>
          {!editTodo && (
            <button
              type="button"
              className="todo__remove"
              data-cy="TodoDeleteButton"
              onClick={() => {
                setSelectedTodoId([todo.id]);
                deleteTodo(todo.id);
              }}
            >
              ×
            </button>
          )}
          {(isLoading
            && selectedTodoId.includes(todo.id))
            && (
              <Loader />
            )}

        </div>
      ))}

    </section>
  );
};
