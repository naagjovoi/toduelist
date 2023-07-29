import {
  IonButton,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  IonContent,
  IonHeader,
  IonInput,
  IonItem,
  IonModal,
  IonPage,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import ExploreContainer from "../components/ExploreContainer";
import "./Home.css";
import axios from "axios";
import { useEffect, useState, useRef } from "react";
import { IonFab, IonFabButton, IonIcon } from "@ionic/react";
import { add } from "ionicons/icons";

const Home: React.FC = () => {
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Need to do</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen>
        <MyCard></MyCard>
      </IonContent>
      <AddButt></AddButt>
    </IonPage>
  );
};

export default Home;

function MyCard() {
  const [data, setData] = useState<any[]>([]);
  const url = "http://toduelistapi.onlinewebshop.net/api/";
  const getTask = async () => {
    const result = await axios.post(`${url}gettask`);
    console.log(result.data.payload);
  };
  getTask();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.post(`${url}gettask`);
        console.log(response.data.payload);
        setData(response.data.payload);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const getData = async () => {
    try {
      const response = await axios.post(`${url}gettask`);
      console.log(response.data.payload);
      setData(response.data.payload);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const deleteTask = async(id:any)=>{
    try {
      const response = await axios.post(`${url}deletetask`,{payload:{id:id}});
      console.log(response.data.payload);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
    getData()
  }

  return (
    <>
      {data == null ? <p>Please create a task</p>: data.map((daTask) => (
        <IonCard key={daTask.id}>
          <IonCardHeader>
            <IonCardTitle>{daTask.task}</IonCardTitle>
            <IonCardSubtitle>{daTask.date}</IonCardSubtitle>
            <IonButton fill="clear" onClick={()=>deleteTask(daTask.id)}>Done ✔️</IonButton>
          </IonCardHeader>
        </IonCard>
      ))}
    </>
  );
}

function AddButt() {
  const [data, setData] = useState('');
  const modal = useRef<HTMLIonModalElement>(null);
  const url = "http://toduelistapi.onlinewebshop.net/api/";
  const change = (event: any) => {
    setData(event.target.value);
    console.log(event.target.value);
  };

  const createTask = async (task: any) => {
    if(task == '') {
      dismiss()
      return
    }
    try {
      const response = await axios.post(`${url}createtask`, {
        payload: { task: task },
      });
      console.log(response.data.payload);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
    console.log(task)
    history.go(0)
    dismiss() 
  };

  function dismiss() {
    modal.current?.dismiss();
  }

  return (
    <>
      <IonFab slot="fixed" vertical="bottom" horizontal="end">
        <IonFabButton id="open-modal">
          <IonIcon icon={add}></IonIcon>
        </IonFabButton>
      </IonFab>
      <IonModal
        className="content"
        ref={modal}
        trigger="open-modal"
        initialBreakpoint={1}
        breakpoints={[0, 1]}
      >
        <div className="block create">
          <div className="container">
            <IonItem>
              <IonInput
                className="text-input"
                label="Enter a task."
                labelPlacement="stacked"
                placeholder="Enter text"
                onInput={change}
              ></IonInput>
            </IonItem>
            <IonButton expand="full" onClick={() => {data == '' ? dismiss()  : createTask(data)}}>
              Create task
            </IonButton>
          </div>
        </div>
      </IonModal>
    </>
  );
}
