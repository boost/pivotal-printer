import React, { Component } from 'react';
import './App.scss';

import Whiteboard from './components/Whiteboard/Whiteboard';
import Template  from './components/Template/Template';

import Select from 'material-ui/Select';
import Input, { InputLabel } from 'material-ui/Input';
import { MenuItem } from 'material-ui/Menu';
import { GridList, GridListTile } from 'material-ui/GridList';
import { FormHelperText } from 'material-ui/Form';

class App extends Component {
  constructor(props){
    super(props);
    this.state = {
      storyState: 'all',
      projectId: null,
    };
  }

  selectStoryType = name => event => {
    this.setState({
      storyState: event.target.value
    });
  }

  selectProjectId = name => event => {
    this.setState({
      projectId: event.target.value
    });
  }

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
              </div>
              {
                this.state.projectId && <Whiteboard storyState={this.state.storyState} projectId={this.state.projectId} />
              }
            </div>
    );
  }
}

export default App;
