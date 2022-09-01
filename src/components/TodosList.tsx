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

type Props = {
  todos: Todo[],
  filterBy: string,
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>,
  setUnableUpdateTodo: React.Dispatch<React.SetStateAction<boolean>>,
  setunableDeleteTodo: React.Dispatch<React.SetStateAction<boolean>>,
};

export const TodosList: React.FC<Props> = (props) => {
  const {
    todos,
    filterBy,
    setTodos,
    setUnableUpdateTodo,
    setunableDeleteTodo,
  } = props;

  const [editTodo, setEditTodo] = useState(false);
  const [todoTitle, setTodoTitle] = useState('');
  const [selectedTodoId, setSelectedTodoId] = useState<number | null>(null);

  const editTodoField = useRef<HTMLInputElement>(null);

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

  const updateTodoStatus = useCallback(
    (todoId: number, todoComleted: boolean) => {
      setSelectedTodoId(todoId);
      client.patch<Todo>(`/todos/${todoId}`, { completed: !todoComleted })
        .then(res => setTodos(prev => [...prev
          .slice(0, prev.findIndex(todo => todo.id === res.id)), res, ...prev
          .slice(prev.findIndex(todo => todo.id === res.id) + 1)]))
        .catch(() => setUnableUpdateTodo(true));
      setSelectedTodoId(null);
    }, [selectedTodoId],
  );

  const deleteTodo = useCallback((todoId: number) => {
    setSelectedTodoId(todoId);
    client.delete(`/todos/${todoId}`)
      .then(res => {
        if (res === 1) {
          setTodos(prev => prev.filter(todo => todo.id !== todoId));
          setSelectedTodoId(null);
        }
      })
      .catch(() => setunableDeleteTodo(true));
  }, []);

  useEffect(() => {
    // focus the element with `ref={newTodoField}`
    if (editTodo) {
      editTodoField.current?.focus();
    }
  }, [editTodo]);

  const updateTodoTitle = useCallback((todoId: number) => {
    setSelectedTodoId(todoId);
    client.patch<Todo>(`/todos/${todoId}`, { title: todoTitle })
      .then(res => {
        setTodos(prev => [...prev.slice(0, prev
          .findIndex(todo => todo.id === res.id)), res, ...prev.slice(prev
          .findIndex(todo => todo.id === res.id) + 1)]);
      });
    setSelectedTodoId(null);
    setTodoTitle('');
    setEditTodo(false);
  }, [todoTitle]);

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
              setSelectedTodoId(todo.id);
              setTodoTitle(todo.title);
              setEditTodo(true);
            }}
          >
            {(editTodo && todo.id === selectedTodoId)
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
              onClick={() => deleteTodo(todo.id)}
            >
              ×
            </button>
          )}

          <div
            data-cy="TodoLoader"
            className={classNames(
              'modal overlay', { 'is-active': false },
            )}
          >
            <div
              className="modal-background has-background-white-ter"
            />
            <div className="loader" />
          </div>
        </div>
      ))}
    </section>
  );
};
