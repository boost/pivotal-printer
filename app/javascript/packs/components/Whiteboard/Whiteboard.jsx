import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';

import Template from '../Template/Template';

export default class Whiteboard extends Component {

  constructor(props) {
    super(props);
    this.state = {
      stories: [],
      isOpen: false,
      selectedStory: null
    };
  }

  handleClickOpen = (story) => {
    this.setState({
                  isOpen: true,
                  selectedStory: story,
    });
  };

  handleCloseDialog = () => {
    this.setState({
                  isOpen: false,
                  selectedStory: null
    });
  };

  componentWillMount() {
    const { projectId } = this.props;
    this.fetchStories(projectId);
  }

  componentWillUpdate(nextProps) {
    const { projectId } = nextProps;
    if (this.props.projectId !== nextProps.projectId) {
      this.fetchStories(projectId);
    }
  }

  fetchStories(projectId) {
    let stories = [];
    const myHeaders = new Headers();
    var myInit = { method: 'GET',
      headers: myHeaders,
      mode: 'cors',
      cache: 'default'
    };
    myHeaders.append('X-TrackerToken', 'b8eaf842166fe3a4ab3684baf643a9bb');
    fetch(`https://www.pivotaltracker.com/services/v5/projects/${projectId}/iterations.json?scope=current`, myInit)
      .then(req => req.json())
      .then(iteration => {
        stories = iteration[0].stories;
        return fetch(`https://www.pivotaltracker.com/services/v5/projects/${projectId}/memberships.json`, myInit)
      })
      .then(req => req.json())
      .then(users => {
        stories = stories.filter((story) => story.owner_ids.length > 0);
        stories = stories.map(story => {
          story['users'] = story.owner_ids.map(id => users.find(u => u.person.id === id))
          return story;
        })
        stories = stories.map(story => {
          story['requestor'] = users.find(u => u.person.id === story.requested_by_id)
          return story;
        })
        stories = stories.sort((a, b) => (a.owner_ids[0] < b.owner_ids[0] ? -1 : 1));
        this.setState({
                      stories: stories
        });
      })
  }

  renderStoryGroup(storyState, group) {
    const stories = this.state.stories
      .filter(story => (story.current_state === storyState || storyState === 'all'))
      .filter(story => story.labels.some(label => label.name === group))
      .map((story) => {
        const name = story.name.split(':')[0];
        return (
                <p key={story.id} className="story" onClick={this.handleClickOpen.bind(this,story)}>
                  <span>{_.capitalize(name)}</span>
                  <span> ({story.users.map(u => u.person.name.split(' ')[0]).join(', ')})</span>
                </p>
        );
      });

    if (stories.length > 0) {
      return (
              <div>
                <h3>{_.startCase(group)}</h3>
                {stories}
              </div>
      )
    }
  }

  render() {
    const { storyState } = this.props;
    const { isOpen, selectedStory } = this.state;
    const groups = ['dnz-services', 'dnz-systems', 'sj-improv', 'metrics dashboard', 'online channel', 'papers past', 'schools', 'natlib2', 'te-puna-foundation']

    return (
            <div className="whiteboard">
              <h1>Whiteboard</h1>
              {groups.map(group => this.renderStoryGroup(storyState, group))}
              { isOpen && <Template
                selectedStory={selectedStory}
                isOpen={isOpen}
                onClose={this.handleCloseDialog}
              /> }
            </div>
    )
  }
}
