import React from 'react';
import ReactDOM from 'react-dom';
import { HubConnectionBuilder } from '@microsoft/signalr';

class TypeColumn extends React.Component {
    constructor(props) {
        super(props);
        this.addNewNote = this.addNewNote.bind(this);
        this.changeNewNoteText = this.changeNewNoteText.bind(this);
        this.hideText = this.hideText.bind(this);
        this.state = {
            hubConnection: null,
            newNoteText: ''
        };
    }

    componentDidMount() {
        
    }

    addNewNote() {
        this.props.Connection.send('Create', this.props.BoardID, this.props.NoteTypeID, this.state.newNoteText);
    }

    changeNewNoteText(event) {
        this.setState({newNoteText: event.target.value});
    }

    hideText(text) {
        var result = "";

        for (var i = 0;  i < text.length; i++) {
            result += "-";
        }

        return result;
    }

    render() {
        var notes = '';

        if(this.props.Notes != null && this.props.Notes.length > 0) {
            const showTexts = this.props.ShowTexts;
            const className = (showTexts ? '' : ' blur');
            notes = this.props.Notes.map((item, i) => {
                return <div key={i} className="card mb-3 bg-light">
                            <div className="card-body p-3">
                                <p className={className}>{showTexts ? item.text : this.hideText(item.text)}</p>
                            </div>
                        </div>
            });
        }

        return <div className="col-12 col-lg-6 col-xl-4">
                    <div className="card card-border-primary">
                        <div className="card-header">
                            <h5 className="card-title">{this.props.Name}</h5>
                            <h6 className="card-subtitle text-muted">Nam pretium turpis et arcu. Duis arcu tortor.</h6>
                        </div>
                        <div className="card-body p-3">
                        <input placeholder='New comment' onChange={this.changeNewNoteText} type="text" />
                            <button className="btn btn-primary btn-block" onClick={this.addNewNote}>Add New Note</button>
                            {notes}
                        </div>
                    </div>
                </div>
    }
}

export default TypeColumn;