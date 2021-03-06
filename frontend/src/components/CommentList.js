import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { withStyles } from 'material-ui/styles'
import List, { ListItem, ListItemText } from 'material-ui/List'
import Typography from 'material-ui/Typography'
import IconButton from 'material-ui/IconButton'
import ArrowUpwardIcon from 'material-ui-icons/ArrowUpward'
import ArrowDownwardIcon from 'material-ui-icons/ArrowDownward'
import EditIcon from 'material-ui-icons/Edit'
import DeleteIcon from 'material-ui-icons/Delete'
import EditCommentDialog from '../components/EditCommentDialog'
import {
  updateComment,
  deleteComment,
  upvoteComment,
  downvoteComment,
  selectComment,
} from '../store/comments/actions'

const styles = theme => ({
  root: {
    width: '100%',
    backgroundColor: theme.palette.background.paper,
  },
})

const propTypes = {
  classes: PropTypes.object.isRequired,
}

class CommentList extends Component {

  state = {
    commentDialogOpen: false,
    selectedComment: undefined,
  }

  /**
   * @description Reduce the vote score of the comment.
   * @param {string} key - Comment ID to modify content of
   */
  handleDownvote = (key) => {
    const { comments, downvoteComment } = this.props
    const comment = comments[key]
    comment.voteScore = comment.voteScore - 1
    downvoteComment({ comment: comment })
  }

  /**
   * @description Increase the vote score of the comment.
   * @param {string} key - Comment ID to modify content of
   */
  handleUpvote = (key) => {
    const { comments, upvoteComment } = this.props
    const comment = comments[key]
    comment.voteScore = comment.voteScore + 1
    upvoteComment({ comment: comment })
  }

  /**
   * @description Set the comment state to deleted with the API server.
   * @param {string} key - Comment ID to delete
   */
  handleDelete = (key) => {
    const { comments, deleteComment } = this.props
    deleteComment({ comment: comments[key] })
  }

  /**
   * @description Select the comment for edit.
   * @param {string} key - ID of the comment to select
   */
  handleEdit = (key) => {
    const { comments, selectComment } = this.props

    selectComment(comments[key])

    this.setState({
      selectedComment: comments[key],
      commentDialogOpen: true,
    })
  }

  /**
   * @description Close the dialog modal after the comment submission.
   */
  closeCommentDialog = () => {
    this.setState({
      commentDialogOpen: false,
    })
  }

  /**
   * @description Edit a comment by submitting to the API.
   * @param {object} comment - The comment to submit to the server
   */
  submitComment = values => {
    const { updateComment } = this.props
    const { selectedComment } = this.state
    const newComment = {
      ...selectedComment,
      author: values.author,
      body: values.body,
    }

    updateComment({ comment: newComment })
    this.closeCommentDialog()

    this.setState({ selectedComment: undefined, })
  }

  render() {
    const { classes, comments } = this.props

    return (
      <div className={classes.root}>
        {comments &&
          <div>
            <List component="nav">
              {Object.keys(comments).map((key) => (
                <div key={key}>
                  {comments[key].deleted === false &&
                    <ListItem divider>
                      <ListItemText
                        primary={comments[key].author}
                        secondary={comments[key].body}
                      />
                      <IconButton
                        aria-label="Vote down"
                        onClick={() => this.handleDownvote.call(this, key)}
                      >
                        <ArrowDownwardIcon />
                      </IconButton>
                      <Typography component="p">
                        {comments[key].voteScore}
                      </Typography>
                      <IconButton
                        aria-label="Vote up"
                        onClick={() => this.handleUpvote.call(this, key)}
                      >
                        <ArrowUpwardIcon />
                      </IconButton>
                      <IconButton
                        aria-label="Edit"
                        onClick={() => this.handleEdit.call(this, key)}
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        aria-label="Delete"
                        onClick={() => this.handleDelete.call(this, key)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </ListItem>
                  }
                </div>
              ))}
            </List>
            {this.state.selectedCommentId !== '' ?
              <EditCommentDialog
                open={this.state.commentDialogOpen}
                onCancel={this.closeCommentDialog}
                onSubmit={this.submitComment}
              />
            : <div />}
          </div>
        }
      </div>
    )
  }
}

CommentList.propTypes = propTypes

const mapStateToProps = state => ({
  comments: state.comments.commentsByPost,
  selectedCommentId: state.comments.selectedCommentId,
})

const mapDispatchToProps = dispatch => ({
  updateComment: (comment) => dispatch(updateComment(comment)),
  deleteComment: (comment) => dispatch(deleteComment(comment)),
  upvoteComment: (comment) => dispatch(upvoteComment(comment)),
  downvoteComment: (comment) => dispatch(downvoteComment(comment)),
  selectComment: (comment) => dispatch(selectComment(comment)),
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(CommentList))
