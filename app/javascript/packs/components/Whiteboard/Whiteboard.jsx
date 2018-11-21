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
    myHeaders.append('X-TrackerToken', 'a8104e0f2cbcedd33f00ff4f94105df6');
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

  selectStoriesByGroup(group, stories) {
    return 
  }

  generateStoryGroups() {
    const storyState = this.props.storyState;
    const stories = this.state.stories;
    const storyGroups = {other: []}
    stories
      .map(story => {
        if (story.current_state === storyState || storyState === 'all') {
            //  find one group and put story in story grpups
          let group = story.labels.length > 0 ? story.labels[0].name : 'other'
          if (!storyGroups[group]) {storyGroups[group] = []}
          storyGroups[group].push((
            <p key={story.id} className="story" onClick={this.handleClickOpen.bind(this,story)}>
              <span>{_.capitalize(story.name.split(':')[0])}</span>
              <span> ({story.users.map(u => (u ? u.person.name.split(' ')[0] : ['No User'])).join(', ')})</span>
            </p>
          ));
        }
      })

    const storyGroupsArray = []
    _.forIn(storyGroups, (stories, storyGroupTitle) => {
      if (stories.length > 0) {
          // debugger
        storyGroupsArray.push((
          <div>
            <h3>{_.startCase(storyGroupTitle)}</h3>
            {stories.map(s => s)}
          </div>
        ))
      }
    })

    return storyGroupsArray
  }

  render() {
    const { isOpen, selectedStory } = this.state;
    let storyGroups = this.generateStoryGroups();
    // debugger
    return (
            <div className="whiteboard">
              <h1>Whiteboard</h1>
              {storyGroups}

              { isOpen && <Template
                 selectedStory={selectedStory}
                 isOpen={isOpen}
                 onClose={this.handleCloseDialog}
                />
               }
            </div>
    )
  }
}
