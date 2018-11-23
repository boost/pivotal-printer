import React, { Component } from 'react';
import './App.scss';

import Whiteboard from './components/Whiteboard/Whiteboard';

import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import Button from '@material-ui/core/Button';
import FormHelperText from '@material-ui/core/FormHelperText';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      storyState: 'all',
      projectId: '152543',
    };
  }

  selectStoryType = (name) => (event) => {
    this.setState({
      storyState: event.target.value,
    });
  };

  selectProjectId = (name) => (event) => {
    this.setState({
      projectId: event.target.value,
    });
  };

  render() {
    return (
            <div className="App">
              <div className="story-status">
                <FormHelperText>Story status</FormHelperText>
                <Select
                  value={this.state.storyState}
                  onChange={this.selectStoryType()}
                >
                  <MenuItem value="all">All</MenuItem>
                  <MenuItem value="accepted">Accepted</MenuItem>
                  <MenuItem value="delivered">Delivered</MenuItem>
                  <MenuItem value="started">Started</MenuItem>
                </Select>
              </div>
              <div className="project">
                <FormHelperText>Project</FormHelperText>
                <Select
                  value={this.state.projectId}
                  onChange={this.selectProjectId()}
                >
                  <MenuItem value="152543">DNZ</MenuItem>
                  <MenuItem value="1646331">Natlib</MenuItem>
                  <MenuItem value="2223004">Archives</MenuItem>
                </Select>
                <Button
                  variant="contained"
                  href="https://basecamp.com/1723294/projects/8491945/messages/new"
                  target="_blank">
                  New message
                </Button>
                <Button
                  variant="contained"
                  href="https://basecamp.com/1723294/projects/8491945/documents/new"
                  target="_blank">
                  New document
                </Button>
              </div>
              {
                this.state.projectId && <Whiteboard storyState={this.state.storyState} projectId={this.state.projectId} />
              }
            </div>
    );
  }
}

export default App;
