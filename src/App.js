import logo from './logo.svg';
import './App.css';
import TypeColumn from './Components/TypeColumn.js';
import { HubConnectionBuilder } from '@microsoft/signalr';
import { useEffect, useState, useRef } from 'react';

function App() {
  const [connection, setConnection] = useState(null);
  const [notes, setNotes] = useState([]);
  const latestColumn = useRef(null);

  latestColumn.current = notes;

  useEffect(() => {
    const newConnection = new HubConnectionBuilder()
                              .withUrl('https://localhost:44313/hubs/note')
                              .withAutomaticReconnect()
                              .build();

    setConnection(newConnection);
  }, []);

  useEffect(() => {
    if(connection) {
      if(connection.connectionStarted) {
        connection.on('GetNotes', note => {
         const updatedColumn = [...latestColumn.current];
         updatedColumn.push(note);
         setNotes(updatedColumn);
        });
      } else {
        connection.start()
        .then(result => {
          console.log("Connected");

          connection.on('GetNotes', note => {
            const updatedColumn = [...latestColumn.current];
            updatedColumn.push(note);
            setNotes(updatedColumn);
          });
        })
      }
    }
  }, [connection]);

  return (
    <div className="App">
        <TypeColumn Notes={notes} Connection={connection} Name="Positive" />
        <TypeColumn Notes={notes} Connection={connection} Name="Negative" />
        <TypeColumn Notes={notes} Connection={connection} Name="Action" />
    </div>
  );
}

export default App;