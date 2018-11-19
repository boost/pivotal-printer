import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Title from '@material-ui/icons/Title';
import Message from '@material-ui/icons/Message';
import Button from '@material-ui/core/Button';
import DeleteIcon from '@material-ui/icons/Delete';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import { withStyles } from '@material-ui/core/styles';
import Snackbar from '@material-ui/core/Snackbar';
import showdown from 'showdown';
import _ from 'lodash';

class Whiteboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      stories: [],
      labels: [],
      open: false,
      copyType: null,
      selectedStory: null,
    };
  }

  handleClickOpen = (story, type) => {
    this.setState({
      open: true,
      copyType: type,
      selectedStory: story,
    });

    setTimeout(() => {
      const copyElement = document.getElementById('story-' + type + '-' + story.id);

      var range = document.createRange();
      range.selectNode(copyElement);
      window.getSelection().removeAllRanges();
      window.getSelection().addRange(range);
      document.execCommand('copy');
    }, 500);
  };

  handleCloseDialog = () => {
    this.setState({
      open: false,
      copyType: null,
      selectedStory: null,
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
    var myInit = {
      method: 'GET',
      headers: myHeaders,
      mode: 'cors',
      cache: 'default',
    };
    myHeaders.append('X-TrackerToken', 'b8eaf842166fe3a4ab3684baf643a9bb');
    fetch(
      `https://www.pivotaltracker.com/services/v5/projects/${projectId}/iterations.json?scope=current`,
      myInit,
    )
      .then((req) => req.json())
      .then((iteration) => {
        stories = iteration[0].stories;
        return fetch(
          `https://www.pivotaltracker.com/services/v5/projects/${projectId}/memberships.json`,
          myInit,
        );
      })
      .then((req) => req.json())
      .then((users) => {
        stories = stories.filter((story) => story.owner_ids.length > 0);
        stories = stories.map((story) => {
          story['users'] = story.owner_ids.map((id) => users.find((u) => u.person.id === id));
          return story;
        });
        stories = stories.map((story) => {
          // fetch requestor details
          story['requestor'] = users.find((u) => u.person.id === story.requested_by_id);

          // fetch request labels
          story['requestor'] = users.find((u) => u.person.id === story.requested_by_id);
          const storyLabels = story.labels.map((a) => a.name);

          // Remove generic labels if there is another one
          let storyWithoutGenericLabels =
            storyLabels.length > 1
              ? _.without(storyLabels, 'dnz-systems', 'dnz-services', 'inv-srv-dnz', 'inv-sys-cloud', 'inv-sys-sj', 'inv-sys-maint')
              : storyLabels;

          if (storyWithoutGenericLabels.length === 0) {
            storyWithoutGenericLabels = storyLabels.length > 1
              ? _.without(storyLabels, 'dnz-systems', 'dnz-services')
              : storyLabels;
          }

          story['labels'] = storyWithoutGenericLabels.map((a) => {
            return { name: a };
          });

          return story;
        });
        stories = stories.sort((a, b) => (a.owner_ids[0] < b.owner_ids[0] ? -1 : 1));
        const labels = _.uniq(_.flatten(stories.map((s) => s.labels.map((l) => l.name))));

        this.setState({
          stories: stories,
          labels: labels,
        });
      });
  }

  renderStoryGroup(storyState, group) {
    const classes = this.props.classes;
    const stories = this.state.stories
      .filter((story) => story.current_state === storyState || storyState === 'all')
      .filter((story) => story.labels.some((label) => label.name === group))
      .map((story) => {
        const name = /([A.a]s( a)?).*([I,i] [want.would.only])/.test(story.name)
          ? story.name.split(':')[0]
          : story.name;

        return (
          <p key={story.id} className={classes.item}>
            <span>{_.capitalize(name)}</span>
            <span> ({story.users.filter((u) => !!u).map((u) => u.person.name.split(' ')[0]).join(', ')})</span>
            <Tooltip title="Copy R4A title">
              <IconButton
                className={classes.copyTitle}
                onClick={this.handleClickOpen.bind(this, story, 'title')}>
                <Title />
              </IconButton>
            </Tooltip>
            <Tooltip title="Copy R4A message">
              <IconButton
                className={classes.copyR4A}
                onClick={this.handleClickOpen.bind(this, story, 'message')}>
                <Message />
              </IconButton>
            </Tooltip>
          </p>
        );
      });

    if (stories.length > 0) {
      return (
        <div className={classes.groups}>
          <h3>
            <strong>{_.startCase(group)}</strong>
          </h3>
          {stories}
          <br />
        </div>
      );
    }
  }

  messageTemplate(story) {
    const converter = new showdown.Converter();
    const storyName = /([A.a]s( a)?).*([I,i] [want.would.only])/.test(story.name)
      ? story.name.split(':')[0].toUpperCase()
      : story.name.toUpperCase();

    return (
      <div className="hidden-story">
        <p>
          <span id={'story-title-' + story.id}>R4A: {storyName}</span>
        </p>
        <div id={'story-message-' + story.id}>
          <p>Hi {story.requestor.person.name},</p>
          <p>
            This <a href={story.url}>story</a> is ready for acceptance.
          </p>
          <br />
          <p dangerouslySetInnerHTML={{ __html: converter.makeHtml(story.description) }} />
          <br />
          <p>
            <strong>What was done</strong>
          </p>
          <p>N/A</p>
          <br />
          <p>
            <strong>How to test</strong>
          </p>
          <p>N/A</p>
          <br />
          <p>
            <strong>Documentation</strong>
          </p>
          <p>Cloud story? Did you update the spreadsheet? :D</p>
          <p>N/A</p>
          <br />
          <p>
            <strong>Code reviewed by</strong>
          </p>
          <p>N/A</p>
          <br />
          <p>
            <strong>Story size changed</strong>
          </p>
          <p>N/A</p>
          <br />
          <p>Thanks</p>
          <p>{story.users[0].person.name}</p>
        </div>
      </div>
    );
  }

  render() {
    const { storyState } = this.props;
    const { open, selectedStory, copyType, labels } = this.state;

    const copyMessage = selectedStory
      ? `Story ${copyType} ${selectedStory.name.substring(0, 30)}... copied to clipboard.`
      : '';

    return (
      <div className="whiteboard">
        <h1>Whiteboard</h1>
        {labels
          .map((label) => this.renderStoryGroup(storyState, label))}

        <Snackbar
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
          open={open}
          onClose={this.handleCloseDialog}
          message={copyMessage}
        />

        {selectedStory && this.messageTemplate(selectedStory)}
      </div>
    );
  }
}

const styles = (theme) => ({
  groups: {
    marginLeft: theme.spacing.unit * 8,
  },
  item: {
    marginBottom: theme.spacing.unit * 1,
    position: 'relative',
  },
  fab: {
    margin: theme.spacing.unit * 2,
  },
  copyR4A: {
    position: 'absolute',
    left: -theme.spacing.unit * 6.5,
    top: -theme.spacing.unit * 2.1,
  },
  copyTitle: {
    position: 'absolute',
    left: -theme.spacing.unit * 11,
    top: -theme.spacing.unit * 2.1,
  },
});

export default withStyles(styles)(Whiteboard);
