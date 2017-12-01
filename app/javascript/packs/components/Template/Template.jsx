import React, { Component } from 'react';

import { EditorState, ContentState, convertFromHTML } from 'draft-js'
import { Editor } from 'react-draft-wysiwyg';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import showdown from 'showdown';
import IconButton from 'material-ui/IconButton';
import CloseIcon from 'material-ui-icons/Close';
import Toolbar from 'material-ui/Toolbar';
import Typography from 'material-ui/Typography';
import AppBar from 'material-ui/AppBar';
import Slide from 'material-ui/transitions/Slide';
import Dialog from 'material-ui/Dialog';
import Button from 'material-ui/Button';
import { withStyles } from 'material-ui/styles';

function Transition(props) {
  return <Slide direction="up" {...props} />;
}

class Template extends Component {

  constructor(props) {
    super(props);

    const { selectedStory } = props;
    const converter = new showdown.Converter();
    const editorContent = `
                             <p>Hi ${selectedStory.requestor.person.name},</p>
                             <p>This <a href=${selectedStory.url}>story</a> is ready for acceptance.</p>
                             <p>${converter.makeHtml(selectedStory.description)}</p>
                             <p>
                               <strong>What was done</strong>
                             </p>
                             <p>N/A</p>
                             <p>
                               <strong>Documentation</strong>
                             </p>
                             <p>N/A</p>
                             <p>
                               <strong>Code reviewed by</strong>
                             </p>
                             <p>N/A</p>
                             <p>
                               <strong>Story size changed</strong>
                             </p>
                             <p>N/A</p>
                             <p>Thanks</p>
                             <p>${selectedStory.users[0].person.name}</p>
    `;
    const contentBlock = convertFromHTML(editorContent);
    if (contentBlock) {
      const contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks);
      const editorState = EditorState.createWithContent(contentState);
      this.state = {
        editorState,
      };
    }
  }

  onEditorStateChange = (editorState) => {
    this.setState({editorState});
  };

  render() {
    const { selectedStory, isOpen, onClose, classes } = this.props;
    const { editorState } = this.state;
    return (
            <Dialog
              fullScreen
              open={isOpen}
              onRequestClose={onClose}
              transition={Transition}
            >
              <AppBar className={classes.appBar}>
                <Toolbar>
                  <Typography type="title" color="inherit" className={classes.flex}>
                    READY FOR ACCEPTANCE: {selectedStory.name.split(':')[0]}
                  </Typography>
                  <Button color="contrast" onClick={onClose}>
                    Close
                  </Button>
                </Toolbar>
              </AppBar>

              <Editor
                editorState={editorState}
                wrapperClassName={classes.dialog}
                editorClassName="demo-editor"
                onEditorStateChange={this.onEditorStateChange}
              />

            </Dialog>
    );
  }
}

const style = theme => ({
                        appBar: {
                          position: 'relative',
                        },
                        flex: {
                          flex: 1,
                        },
                        dialog: {
                          height: '70%',
                          padding: '1.5rem 3rem'
                        }
});

export default withStyles(style)(Template);
