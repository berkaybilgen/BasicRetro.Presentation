import logo from './logo.svg';
import './App.css';
import TypeColumn from './Components/TypeColumn.js';
import { HubConnectionBuilder } from '@microsoft/signalr';
import { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';

function Board() {
  const [connection, setConnection] = useState(null);
  const [notes, setNotes] = useState([]);
  const [board, setBoard] = useState({ id: 0, name: "" });
  const [getNotes, setGetNotes] = useState(true);
  const [showTexts, setShowTexts] = useState(false);
  const latestColumn = useRef(null);
  const apiUrl = 'https://basicretro.berkaybilgen.com';
  let id = '34A16C68-B838-45A5-B250-74DBEF242EEC';

  latestColumn.current = notes;

  useEffect(() => {
    const jquery = document.createElement("script");
    jquery.src = "https://code.jquery.com/jquery-1.10.2.min.js";
    jquery.async = true;
    document.body.appendChild(jquery);

    /*
    const bootstrap = document.createElement("script");
    bootstrap.src = "https://cdn.jsdelivr.net/npm/bootstrap@4.1.1/dist/js/bootstrap.bundle.min.js";
    bootstrap.async = true;
    document.body.appendChild(bootstrap);
    */

    if(getNotes) {
      getBoardInfo();
      getCurrentNotes();
      setGetNotes(false);
    }

    const newConnection = new HubConnectionBuilder()
                              .withUrl(apiUrl + '/hubs/note')
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
        connection.start({ withCredentials: false })
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
    fetch(apiUrl + '/Board/notes?boardID=' + id)
      .then(result => result.json())
      .then(result => {
        setNotes(result);
      })
  }

  function getBoardInfo() {
    fetch(apiUrl + '/Board?boardID=' + id)
      .then(result => result.json())
      .then(result => {
        setBoard(result);
      })
  }

  function getNotesByType(noteTypeID) {
    return notes.filter((note) => {
        return note.noteTypeID == noteTypeID.toLowerCase()
    })
  }

  function flip() {
    setShowTexts(!showTexts);
  }

  return (
    <main className="content">
      <div className="container p-0">
        <div className="row">
          <div className="board-info">
            <h1>Board = {board.name}</h1>
            <button onClick={flip} className='flip'>Flip Texts</button>
          </div>
          <TypeColumn key="1" ShowTexts={showTexts} BoardID={id} NoteTypeID="B5195139-2F1B-44E5-AF3C-089A74766D03" Notes={getNotesByType("B5195139-2F1B-44E5-AF3C-089A74766D03")} Connection={connection} Color="green" Name="Positive" />
          <TypeColumn key="2" ShowTexts={showTexts} BoardID={id} NoteTypeID="98DCAE83-D031-4DEF-968A-1495E315FE4C" Notes={getNotesByType("98DCAE83-D031-4DEF-968A-1495E315FE4C")} Connection={connection} Color="red" Name="Negative" />
          <TypeColumn key="3" ShowTexts={showTexts} BoardID={id} NoteTypeID="8CE5B5D7-1502-40A4-A7C8-48CBAF03D005" Notes={getNotesByType("8CE5B5D7-1502-40A4-A7C8-48CBAF03D005")} Connection={connection} Color="yellow" Name="Action" />
        </div>
      </div>
    </main>
  );
}

export default Board;
