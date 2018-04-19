import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Autosuggest from 'react-autosuggest';
import TextField from 'material-ui/TextField';
import Paper from 'material-ui/Paper';
import { MenuItem } from 'material-ui/Menu';
import match from 'autosuggest-highlight/match';
import parse from 'autosuggest-highlight/parse';
import { withStyles } from 'material-ui/styles';
import _ from 'lodash';
import Template from '../Template/Template';
import Button from 'material-ui/Button';

class Search extends Component {

  constructor(props) {
    super(props);
    this.state = {
      value: '',
      suggestions: [],
      story: null,
    };

    this.debounceFetchStories = _.debounce(this.fetchStories, 500);
  }

  fetchStories(query) {
    if (query.length < 3) return;
    const myHeaders = new Headers();
    var myInit = { method: 'GET',
      headers: myHeaders,
      mode: 'cors',
      cache: 'default'
    };
    myHeaders.append('X-TrackerToken', 'b8eaf842166fe3a4ab3684baf643a9bb');
    fetch(`https://www.pivotaltracker.com/services/v5/projects/152543/search?query=${query}`, myInit)
      .then(req => req.json())
      .then((search) => {
        const storyNames = search.stories.stories.map((a) => a.name);
        this.setState({
          suggestions: storyNames
        });
        this.stories = search.stories.stories;
      })
  }


  renderInput(inputProps) {
    const { classes, autoFocus, value, ref, ...other } = inputProps;

    return (
      <TextField
        autoFocus={autoFocus}
        className={classes.textField}
        value={value}
        inputRef={ref}
        InputProps={{
          classes: {
            input: classes.input,
          },
          ...other,
        }}
      />
    );
  }

  renderSuggestion(suggestion, { query, isHighlighted }) {
    const matches = match(suggestion, query);
    const parts = parse(suggestion, matches);

    return (
      <MenuItem selected={isHighlighted} component="div">
        <div>
          {parts.map((part, index) => {
            return part.highlight ? (
              <span key={index} style={{ fontWeight: 300 }}>
                {part.text}
              </span>
            ) : (
              <strong key={index} style={{ fontWeight: 250 }}>
                {part.text}
              </strong>
            );
          })}
        </div>
      </MenuItem>
    );
  }

  renderSuggestionsContainer(options) {
    const { containerProps, children } = options;

    return (
      <Paper {...containerProps} square>
        {children}
      </Paper>
    );
  }

  getSuggestionValue(suggestion) {
    const story = this.stories.find(story => story.name === suggestion);
    console.log('TODO: change template state --' + story.name);
    this.setState({story: story});
    return suggestion;
  }

  handleSuggestionsFetchRequested = ({ value }) => {
    this.debounceFetchStories(value);
  };

  handleSuggestionsClearRequested = () => {
    this.setState({
      value: '',
      suggestions: [],
    });
  };

  handleChange = (event, { newValue }) => {
    this.setState({
      value: newValue,
    });
  };

  render() {
    const { classes } = this.props;

    return (
      <div>
        <Autosuggest
          theme={{
            container: classes.container,
            suggestionsContainerOpen: classes.suggestionsContainerOpen,
            suggestionsList: classes.suggestionsList,
            suggestion: classes.suggestion,
          }}
          renderInputComponent={this.renderInput}
          suggestions={this.state.suggestions}
          onSuggestionsFetchRequested={this.handleSuggestionsFetchRequested}
          onSuggestionsClearRequested={this.handleSuggestionsClearRequested}
          renderSuggestionsContainer={this.renderSuggestionsContainer}
          getSuggestionValue={this.getSuggestionValue.bind(this)}
          renderSuggestion={this.renderSuggestion}
          inputProps={{
            autoFocus: true,
            classes,
            placeholder: 'Search for a Pivotal Story',
            value: this.state.value,
            onChange: this.handleChange,
          }}
        />
        { this.state.story && <Template
          title={this.state.story.name}
          link={'https://www.pivotaltracker.com/n/projects/152543/stories/' + this.state.story.id}
          acceptanceCriteria={this.state.story.description}
        />}
        { this.state.story &&
        <Button raised color="primary">
          Create basecamp message
        </Button>
        }
      </div>
    );
  }
}

Search.propTypes = {
  classes: PropTypes.object.isRequired,
};

const style = theme => ({
  container: {
    flexGrow: 1,
    position: 'relative',
  },
  suggestionsContainerOpen: {
    position: 'absolute',
    marginTop: theme.spacing.unit,
    marginBottom: theme.spacing.unit * 3,
    left: 0,
    right: 0,
  },
  suggestion: {
    display: 'block',
  },
  suggestionsList: {
    margin: 0,
    padding: 0,
    listStyleType: 'none',
  },
  textField: {
    width: '100%',
  },
  input: {
    height: '50px',
  },
});

export default withStyles(style)(Search);
