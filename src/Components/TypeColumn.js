import React from 'react';
import ReactDOM from 'react-dom';
import { HubConnectionBuilder } from '@microsoft/signalr';

class TypeColumn extends React.Component {
    constructor(props) {
        super(props);
        this.addNewNote = this.addNewNote.bind(this);
        this.changeNewNoteText = this.changeNewNoteText.bind(this);
        this.state = {
            hubConnection: null,
            newNoteText: ''
        };
    }

    componentDidMount() {
        
    }

    addNewNote() {
        this.props.Connection.send('Create', this.state.newNoteText);
        this.setState({ newNoteText: ''});
    }

    changeNewNoteText(event) {
        this.setState({newNoteText: event.target.value});
    }

    render() {
        var notes = '';

        if(this.props.Notes != null && this.props.Notes.length > 0) {
            notes = this.props.Notes.map(function(item, i) {
                return <span className='note-text' key={i}>{item}</span>
            });
        }

        return <div className="type-column">
                    <h1>{this.props.Name}</h1>
                    <input onChange={this.changeNewNoteText} type="text" />
                    <button onClick={this.addNewNote}>Add New Note</button>
                    {notes}
                </div>
    }
}

export default TypeColumn;