import { Fab, Grid } from '@mui/material';
import React, { useCallback, useState } from 'react';
import AddIcon from '@mui/icons-material/Add';
import { DragDropContext } from 'react-beautiful-dnd';
import DrawerTask from './DrawerTask';
import { MTaskDataModel, StatusEnum } from '../../models/todo/DataModel';
import HeadApp from './Head';
import TodoList from './Content/TodoList';
import DoingList from './Content/DoingList';
import DoneList from './Content/DoneList';
import { TempTodoList } from '../../constants/fake';

const TodoApp = () => {
  const [openDrawer, setOpenDrawer] = useState(false);
  const [rendered, setRendered] = useState(false);

  const [todoList, setTodoList] = useState<MTaskDataModel[]>(TempTodoList);
  const [taskItem, setTaskItem] = useState<any>(null);

  const GetTodoList = (status: StatusEnum) =>
    todoList.filter((task: MTaskDataModel) => task.status === status);

  const onDragEnd = useCallback(
    (result: any) => {
      const destinationID = result?.destination?.droppableId;
      const draggableId = result?.draggableId;

      if (destinationID === StatusEnum.DOING) {
        let findTask = todoList.find((item: MTaskDataModel) => item.id === draggableId);
        setTodoList(
          todoList.map((item: MTaskDataModel) =>
            item.id === draggableId
              ? { ...item, ...{ ...findTask, status: StatusEnum.DOING } }
              : item,
          ),
        );
      }
    },
    [todoList],
  );

  const AddTask = (task: MTaskDataModel) => setTodoList((old: any) => [...old, ...[task]]);

  const UpdateTask = (id: string, task: MTaskDataModel) =>
    setTodoList(
      todoList.map((item: MTaskDataModel) => (item.id === id ? { ...item, ...task } : item)),
    );

  const DeleteTask = (id: string) => setTodoList(todoList.filter((item: any) => item.id !== id));

  const TodoContent = (
    <div className="flex flex-col w-full items-center bg-indigo-50 h-full border  rounded-lg overflow-scroll">
      <DragDropContext onDragEnd={onDragEnd}>
        <Grid container>
          <TodoList
            todoList={GetTodoList(StatusEnum.TODO)}
            setOpenDrawer={setOpenDrawer}
            setTaskItem={setTaskItem}
            updateTask={UpdateTask}
          />

          <DoingList
            doingList={GetTodoList(StatusEnum.DOING)}
            setOpenDrawer={setOpenDrawer}
            setTaskItem={setTaskItem}
            updateTask={UpdateTask}
          />

          <DoneList
            doneList={GetTodoList(StatusEnum.DONE)}
            setOpenDrawer={setOpenDrawer}
            setTaskItem={setTaskItem}
            updateTask={UpdateTask}
          />
        </Grid>
      </DragDropContext>
    </div>
  );

  return (
    <div className="w-full flex flex-col items-center ">
      <HeadApp
        todoList={todoList}
        setTodoList={setTodoList}
        setRendered={() => setRendered(!rendered)}
      />

      <div className="w-2/3 ">{TodoContent}</div>

      <div className="absolute right-8 bottom-8 ">
        <Fab
          color="primary"
          aria-label="add"
          onClick={() => {
            setOpenDrawer(true);
            if (taskItem) setTaskItem(null);
          }}
        >
          <AddIcon />
        </Fab>
      </div>

      <DrawerTask
        openDrawer={openDrawer}
        closeDrawer={setOpenDrawer}
        taskItem={taskItem}
        addTask={AddTask}
        updateTask={UpdateTask}
        deleteTask={DeleteTask}
      />
    </div>
  );
};

export default TodoApp;
