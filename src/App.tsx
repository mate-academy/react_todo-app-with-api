/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useRef, useState } from 'react';
import cn from 'classnames';
import { deleteTodo, getTodos, patchTodo, postTodo } from './api/todos';
import { Todo } from './types/Todo';
import { Footer } from './Footer';
import { Header } from './Header';
import { Status } from './enums/status';
import { Title } from './Title';
import { Error } from './Error';
import { Loader } from './Loader';
import { Form } from './Form';

export const App: React.FC = () => {
  const [isLoading, setIsLoading] = useState<number[]>([]);
  const [isEdited, setIsEdited] = useState<number | null>(null);
  const [editedTitle, setEditedTitle] = useState('');
  const [newTitle, setNewTitle] = useState('');
  const [errMessage, setErrMessage] = useState('');
  const [stat, setStat] = useState(Status.all);
  const [visibleErr, setVisibleErr] = useState(false);
  const [tempTodo, setTempTodo] = useState<Todo[] | null>(null);
  const [todos, setTodos] = useState<Todo[]>([]);
  const editSelectedInput = useRef<HTMLInputElement>(null);

  const filteredTodos = (tod: Todo[], type: Status) => {
    switch (type) {
      case Status.active:
        return tod.filter(todo => !todo.completed);
      case Status.completed:
        return tod.filter(todo => todo.completed);

      default:
        return tod;
    }
  };

  const visibleTodos = tempTodo
    ? filteredTodos(tempTodo, stat)
    : filteredTodos(todos, stat);

  const isAnyCompleted = todos.some(todo => todo.completed);

  //for reset errors
  const resetErr = () =>
    setTimeout(() => {
      setVisibleErr(false);
      setErrMessage('');
    }, 2500);

  //for load todos at the begining
  useEffect(() => {
    const loadTodos = async () => {
      getTodos()
        .then(setTodos)
        .catch(() => {
          setVisibleErr(true);
          setErrMessage('Unable to load todos');
          resetErr();
        });
    };

    loadTodos();
  }, []);

  //for focus on edited todo
  useEffect(() => {
    if (editSelectedInput.current) {
      editSelectedInput.current.focus();
    }
  }, [isEdited]);

  const updateTodo = async (updatedTodo: Todo, option: keyof Todo) => {
    try {
      setIsLoading([updatedTodo.id]);
      const todoToUpdate = todos.find(tod => tod.id === updatedTodo.id);

      let newTodo: Todo = {
        id: 0,
        userId: 0,
        title: '',
        completed: false,
      };

      if (option === 'completed' && todoToUpdate) {
        newTodo = { ...todoToUpdate, completed: !updatedTodo.completed };
      }

      if (option === 'title' && todoToUpdate) {
        const trimedTitle = editedTitle.trim();

        if (trimedTitle === '') {
          setVisibleErr(true);
          setErrMessage('Title should not be empty');
          resetErr();
          deleteTodo(todoToUpdate.id).then(async () => {
            const loadTodos = getTodos();

            setTodos(await loadTodos);
          });

          return;
        }

        if (trimedTitle === todoToUpdate.title) {
          setEditedTitle('');

          return;
        }

        newTodo = { ...todoToUpdate, title: trimedTitle };
      }

      await patchTodo(newTodo).then(response =>
        setTodos(prevState => {
          if (prevState.find(todo => todo.id === response.id)) {
            return prevState.map(todo =>
              todo.id === response.id ? response : todo,
            );
          }

          return [...prevState];
        }),
      );
    } catch {
      setVisibleErr(true);
      setErrMessage('Unable to update a todo');
      resetErr();
    } finally {
      setIsLoading([]);
      setEditedTitle('');
    }
  };

  const addTodo = async () => {
    const trimedTitle = newTitle.trim();

    if (trimedTitle === '') {
      setVisibleErr(true);
      setErrMessage('Title should not be empty');
      resetErr();

      return;
    }

    if (trimedTitle !== '') {
      const newTodo: Todo = {
        id: 0,
        userId: 472,
        title: trimedTitle,
        completed: false,
      };

      const temp = {
        id: 0,
        userId: 472,
        title: trimedTitle,
        completed: false,
      };

      setTempTodo([...todos, temp]);

      try {
        setIsLoading([0]);

        await postTodo(newTodo).then(respond => {
          setTempTodo(null);
          setTodos(prevTodos => [...prevTodos, respond]);
          setNewTitle('');
        });
      } catch (error) {
        setIsLoading([]);
        setTempTodo(null);
        setVisibleErr(true);
        setErrMessage('Unable to add a todo');
        resetErr();
      } finally {
        setIsLoading([]);
      }
    }
  };

  const removeTodo = async (todoToRmove: Todo) => {
    try {
      setIsLoading(state => [...state, todoToRmove.id]);

      await deleteTodo(todoToRmove.id).then(() =>
        setTodos(prevTodos => {
          return prevTodos.filter(prevTodo => prevTodo.id !== todoToRmove.id);
        }),
      );
    } catch {
      setVisibleErr(true);
      setErrMessage('Unable to delete a todo');
      resetErr();
    } finally {
      setIsLoading([]);
    }
  };

  const handleEditedTitle = (todo: Todo) => {
    updateTodo(todo, 'title');
    setIsEdited(null);
  };

  const handleRemoveButton = (
    todo: Todo,
    event: React.MouseEvent<HTMLButtonElement>,
  ) => {
    event.preventDefault();
    removeTodo(todo);
  };

  const handleKeyUpInputEdit = (event: React.KeyboardEvent) => {
    if (event.key === 'Escape') {
      setIsEdited(null);
      setEditedTitle('');
    }
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    addTodo();
  };

  const handleEditSubmit = (event: React.FormEvent, todo: Todo) => {
    event.preventDefault();
    handleEditedTitle(todo);
  };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          setErrMessage={setErrMessage}
          setIsLoading={setIsLoading}
          setTodos={setTodos}
          isLoading={isLoading}
          todos={todos}
          handleSubmit={handleSubmit}
          newTitle={newTitle}
          setNewTitle={setNewTitle}
        />

        <section className="todoapp__main" data-cy="TodoList">
          {visibleTodos.map(todo => (
            <div
              key={todo.id}
              data-cy="Todo"
              className={cn('todo', { completed: todo.completed })}
            >
              <label className="todo__status-label">
                <input
                  data-cy="TodoStatus"
                  type="checkbox"
                  className="todo__status"
                  checked={todo.completed}
                  onChange={() => updateTodo(todo, 'completed')}
                />
              </label>
              {isEdited !== todo.id && (
                <Title
                  handleRemoveButton={handleRemoveButton}
                  todo={todo}
                  setIsEdited={setIsEdited}
                />
              )}
              {isEdited === todo.id && (
                <Form
                  todo={todo}
                  handleEditSubmit={handleEditSubmit}
                  setEditedTitle={setEditedTitle}
                  editedTitle={editedTitle}
                  handleKeyUpInputEdit={handleKeyUpInputEdit}
                  editSelectedInput={editSelectedInput}
                  setIsEdited={setIsEdited}
                  handleEditedTitle={handleEditedTitle}
                />
              )}

              <Loader todoId={todo.id} isLoading={isLoading} />
            </div>
          ))}
        </section>

        {todos.length > 0 && (
          <Footer
            removeTodo={removeTodo}
            setIsLoading={setIsLoading}
            setErrMessage={setErrMessage}
            setTodos={setTodos}
            stat={stat}
            todos={todos}
            isAnyCompleted={isAnyCompleted}
            setStat={setStat}
          />
        )}
      </div>

      <Error
        visibleErr={visibleErr}
        setVisibleErr={setVisibleErr}
        errMessage={errMessage}
      />
    </div>
  );
};
