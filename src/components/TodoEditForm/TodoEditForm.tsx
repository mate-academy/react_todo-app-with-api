import React from 'react';

type Props = {
  title: string,
  onEditingSkip: () => void;
  onTodoTitleUpdate: (newTitle: string) => Promise<void>;
  onTodoDelete: () => Promise<void>;
};

type State = {
  title: string | null;
};

export class TodoEditForm extends React.Component<Props, State> {
  state = {
    title: null,
  }

  private inputRef: React.RefObject<HTMLInputElement> = React.createRef();

  static getDerivedStateFromProps(props: Props, state: State) {
    if (state.title === null) {
      return {
        title: props.title,
      };
    }

    return null;
  }

  componentDidMount(): void {
    const todoTitleInput = this.inputRef.current;

    if (!todoTitleInput) {
      return;
    }

    todoTitleInput.focus();
    todoTitleInput.addEventListener('keyup', this.handleTodoEditingSkip);
  }

  componentWillUnmount(): void {
    const todoTitleInput = this.inputRef.current;

    if (!todoTitleInput) {
      return;
    }

    todoTitleInput.removeEventListener('keyup', this.handleTodoEditingSkip);
  }

  handleTodoEditingSkip = (escClickEvent: KeyboardEvent) => {
    if (escClickEvent.key !== 'Escape' || !this.inputRef.current) {
      return;
    }

    this.props.onEditingSkip();
    this.inputRef.current.blur();
  };

  handleTodoUpdate = async () => {
    const { title } = this.state;
    const {
      onEditingSkip,
      onTodoTitleUpdate,
      onTodoDelete,
    } = this.props;

    if (!title) {
      await onTodoDelete();

      return;
    }

    if (title === this.props.title) {
      onEditingSkip();

      return;
    }

    await onTodoTitleUpdate(title);
  }

  handleFormSubmit = (submitEvent: React.SyntheticEvent) => {
    submitEvent.preventDefault();
    this.handleTodoUpdate();
  }

  handleTitleChange = (changeEvent: React.ChangeEvent<HTMLInputElement>) => (
    this.setState({
      title: changeEvent.target.value,
    })
  );

  render() {
    const title = this.state.title ?? '';

    const {
      handleFormSubmit,
      handleTitleChange,
      handleTodoUpdate,
      inputRef,
    } = this;

    return (
      <form onSubmit={handleFormSubmit}>
        <input
          type="text"
          className="todo__title-field"
          placeholder="Empty todo will be deleted"
          value={title}
          onChange={handleTitleChange}
          onBlur={handleTodoUpdate}
          ref={inputRef}
        />
      </form>
    );
  }
}
