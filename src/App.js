import { useState } from "react";
import { Modal, Button, IconButton, Checkbox, TextareaAutosize, Container, List, ListItem,  ListItemText, makeStyles, Typography, } from "@material-ui/core";
import { useStore } from "./todoStore.ts";
import CloseIcon from "@material-ui/icons/Close";
import CircleChecked from '@material-ui/icons/CheckCircleOutline';
import CircleUnchecked from '@material-ui/icons/RadioButtonUnchecked';
import ReactMarkdown from 'react-markdown'
import moment from 'moment';
import './App.css';



const useStyles = makeStyles((theme) => ({
  headerTextStyles: {
    textAlign: "left",
    marginBottom: theme.spacing(3),
    marginTop: theme.spacing(5),
  },
  dateTextStyles:{
    fontSize:'x-small',
    marginLeft:theme.spacing(2)
  },
  textBoxStyles: {
    marginBottom: theme.spacing(1),
    color:'#fff',
    border: 'none',
    width: '100%',
    background: 'none',
    outline: 'none',
  },
  textBoxEditStyles: {
    marginBottom: theme.spacing(1),
    color:'#fff',
    border: 'none',
    fontSize:"x-large",
    width: '100%',
    background: 'none',
    outline: 'none',
  },
  addButtonStyles: {
    marginBottom: theme.spacing(2),
    display:"inline",
    width:'auto',
    marginLeft:'2',
    alignContent:theme.spacing(2),
    alignSelf:'left'
  },
  completedTodoStyles: {
    textDecoration: "line-through",
  },
  textAreaStyles :{
    width:"100%",
    border: 'none',
    background: 'none',
    color:'white',
    outline: 'none',
  },
  modalStyles:{
    position: 'absolute',
    width:400,
    backgroundColor: '#282828',
    border:'2px;solid;000',
    padding: '16px;32px,24px',
    top: '50%',
    left: '50%',
    transform: "translate(-50%, -50%)"
  },
  closeModalButton: {
    position: 'absolute',
    left: '95%',
    top: '-9%',
    backgroundColor: 'lightgray',
    color: 'gray',
  },
  descriptionStyles:{
    color: 'gray',
    display: 'inline-flex',
    marginLeft: '50px',
    zoom: '.6',
    alignItems: 'baseline',
  },
}));

function App() {
  const {
    headerTextStyles,
    textBoxStyles,
    addButtonStyles,
    completedTodoStyles,
    textAreaStyles,
    dateTextStyles,
    textBoxEditStyles,
    closeModalButton,
    descriptionStyles,
    modalStyles
  } = useStyles();
  const [todoTitle, setTodoTitle] = useState("");
  const [todoDesc, setTodoDesc] = useState("");
  const { addTodo, saveChangeTodo, removeTodo, toggleCompletedState, todos } = useStore();
  const [modal, setModal]=useState(false);
  const [newTaskForm, setNewTaskForm]=useState(false);
  const [todoEditTitle, setEditTodoTitle] = useState("");
  const [todoEditDesc, setEditTodoDesc] = useState("");
  const [todoEditId, setEditTodoId] = useState("");
  const [showMarkdown, setShowMarkdown]= useState(true);

  const openCloseModal = ()=>{
    setShowMarkdown(true);
    setModal(!modal);
  }

  const editModal = (id,title, desc) =>{
    setEditTodoTitle(title);
    setEditTodoDesc(desc);
    setEditTodoId(id);
    openCloseModal();
  }

  const date  = moment().format('DD MMM');

  const formNewTask = (
    <div textAlign="left">
        
        <input
        className={textBoxStyles}
        label='Todo Title'
        required
        variant='outlined'
        fullWidth
        placeholder="For example design meeting 9am"
        onChange={(e) => setTodoTitle(e.target.value)}
        value={todoTitle}
        onKeyPress={(e) => {
          if (e.nativeEvent.charCode === 13) {
            if (todoTitle.length) {
              addTodo(todoTitle, todoDesc);
              setTodoTitle("");
              setTodoDesc("");
            }
          }
        }}    
      />

       <TextareaAutosize
        className={textAreaStyles}
        aria-label="minimum height"
        minRows={5}
        placeholder="Description"
        label='Todo Description'
        required
        variant='outlined'
        fullWidth
        onChange={(e) => setTodoDesc(e.target.value)}
        value={todoDesc}
      />

      <Button
        className={addButtonStyles}
        variant='contained'  
        onClick={() => {
          if (todoTitle.length) {
            addTodo(todoTitle, todoDesc);
            setTodoTitle("");
            setTodoDesc("");
            setNewTaskForm(!newTaskForm);
          }
        }}
      >
        + Add Task
      </Button> 
      <Button variant="outline" color='primary' className={addButtonStyles}
        onClick={()=>{
          setTodoTitle("");
          setTodoDesc("");
          setNewTaskForm(!newTaskForm);
        }}
      >
        Cancel
      </Button> 
    </div>
  )

  const bodyModal=(
    <div className={modalStyles}>
      <IconButton className={closeModalButton}
       onClick={()=>{openCloseModal()}}>
      <CloseIcon />
    </IconButton>

    <input
        placeholder="Title"
        fontSize="20em"
        className={textBoxEditStyles}
        label='Todo Title'
        required
        variant='outlined'
        fullWidth
        onChange={(e) => setEditTodoTitle(e.target.value)}
        value={todoEditTitle}
      />

      {showMarkdown?
      <div  onClick={() => {setShowMarkdown(false)}}> < ReactMarkdown>{todoEditDesc.length<1?"Description":todoEditDesc}</ReactMarkdown> </div>
        :
        <TextareaAutosize
          className={textAreaStyles}
          aria-label="minimum height"
          minRows={5}
          placeholder="Description"
          label='Todo Description'
          required
          variant='outlined'
          fullWidth
          onChange={(e) => setEditTodoDesc(e.target.value)}
          value={todoEditDesc}
        />
      }
      <Button
        className={addButtonStyles}
        variant='contained'
        onClick={() => {
          if (todoEditTitle.length) {
            saveChangeTodo(todoEditId,todoEditTitle, todoEditDesc);
            setEditTodoTitle("");
            setEditTodoId("");
            setEditTodoDesc("");
            openCloseModal();
          }
        }}
      >
        Save Changes 
      </Button>

      <Button
        variant="outline" color='primary' className={addButtonStyles}
        onClick={() => {
          removeTodo(todoEditId);
          setEditTodoTitle("");
          setEditTodoId("");
          setEditTodoDesc("");
          openCloseModal();
        }}              
        >
          Delete
      </Button>

    </div>
  )

  return (
    <Container className="App" maxWidth='md'>
      <Typography variant='h5' className={headerTextStyles}>
        To-Do List  <Typography variant='p' className={dateTextStyles}>{date} </Typography> 
      </Typography>

      <List>
        {todos.map((todo) => (
          <ListItem key={todo.id} style={{ backgroundColor: todo.completed? 'rgba(0, 150, 0, 0.5)': ''}} className="listItem">
            <Checkbox
            style={{color:'white'}}           
              icon={<CircleUnchecked />}
              checkedIcon={<CircleChecked />}
                edge='start'
                checked={todo.completed}
                onChange={() => toggleCompletedState(todo.id)}
              />
            <ListItemText
              className={todo.completed ? completedTodoStyles : ""}
              key={todo.id}
              onClick={() => editModal(todo.id, todo.title, todo.description)}
            >
              {todo.title}
              <div className={descriptionStyles}>
                < ReactMarkdown>
                  {todo.description}
                </ReactMarkdown>
              </div>
            </ListItemText>                        
          </ListItem>         

        ))}
      </List>
    
      {newTaskForm?formNewTask: <Button textAlign="left"  variant="contained" onClick={()=>{setNewTaskForm(true)}}>+ Add Task</Button>}

      <Modal open={modal} onClose={openCloseModal}>
                {bodyModal}
      </Modal>
      </Container>
    
  );
}

export default App;
