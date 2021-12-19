import logo from './logo.svg';
import './App.css';
import TypeColumn from './Components/TypeColumn.js';
import { HubConnectionBuilder } from '@microsoft/signalr';
import { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';

function Board() {
  const [connection, setConnection] = useState(null);
  const [notes, setNotes] = useState([]);
  const [getNotes, setGetNotes] = useState(true);
  const [showTexts, setShowTexts] = useState(false);
  const latestColumn = useRef(null);
  let { id } = useParams();

  latestColumn.current = notes;

  useEffect(() => {
    if(getNotes) {
      getCurrentNotes();
      setGetNotes(false);
    }

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
         updatedColumn.push({ text: note.text, noteTypeID: note.noteTypeID });
         setNotes(updatedColumn);
        });
      } else {
        connection.start()
        .then(result => {
          console.log("Connected");

          connection.on('GetNotes', note => {
            const updatedColumn = [...latestColumn.current];
            updatedColumn.push({ text: note.text, noteTypeID: note.noteTypeID });
            setNotes(updatedColumn);
          });
        })
      }
    }
  }, [connection]);

  function getCurrentNotes() {
    fetch('https://localhost:44313/Board/notes?boardID=' + id)
      .then(result => result.json())
      .then(result => {
        setNotes(result);
      })
  }

  function getNotesByType(noteTypeID) {
    return notes.filter((note) => {
        return note.noteTypeID == noteTypeID.toLowerCase()
    })
  }

  return (
    <div className="App">
        <h1>Board = {id}</h1>
        <TypeColumn ShowTexts={showTexts} BoardID={id} NoteTypeID="B5195139-2F1B-44E5-AF3C-089A74766D03" Notes={getNotesByType("B5195139-2F1B-44E5-AF3C-089A74766D03")} Connection={connection} Color="green" Name="Positive" />
        <TypeColumn ShowTexts={showTexts} BoardID={id} NoteTypeID="98DCAE83-D031-4DEF-968A-1495E315FE4C" Notes={getNotesByType("98DCAE83-D031-4DEF-968A-1495E315FE4C")} Connection={connection} Color="red" Name="Negative" />
        <TypeColumn ShowTexts={showTexts} BoardID={id} NoteTypeID="8CE5B5D7-1502-40A4-A7C8-48CBAF03D005" Notes={getNotesByType("8CE5B5D7-1502-40A4-A7C8-48CBAF03D005")} Connection={connection} Color="yellow" Name="Action" />
    </div>
  );
}

export default Board;
