import React, { useState } from 'react'
import Comment from './Comment'
import { makeStyles } from '@material-ui/core/styles';
import {
  Grid,
  Button,
  Typography,
  Card,
  CardHeader,
  Avatar,
  CardActions,
  CardContent,
  ExpansionPanel,
  ExpansionPanelSummary,
  ExpansionPanelDetails,
  TextField,
  IconButton
} from '@material-ui/core';
import { FavoriteBorderOutlined, InsertComment } from '@material-ui/icons'
import { app } from "../../config/base";
import { Link } from 'react-router-dom'

const useStyles = makeStyles(() => ({
  root: {
    flexGrow: 1,
  },
  paper: {
    width: '90vh',
    margin: '1rem 0'
  },
  comment: {
    width: '80vh',
    margin: '1rem 0'
  },
  heading: {
    width: '-webkit-fill-available',
  },
  commentBar: {
    width: '-webkit-fill-available',
    margin: '1rem auto '
  },
  counter: {
    fontSize: '0.6rem',
    position: 'relative',
    top: '-10px',
    right: '20px',
    padding: '5px 8px',
    borderRadius: '50%',
    background: '#818181',
    color: 'white'
  },
  commentSection: {
    maxHeight: '55vh',
    overflowY: 'auto'
  }
}))

const setCommentAuthorName = () => {
  const user = app.auth().currentUser;
  const name = user.displayName;

  return name
}

export default function Post(props) {
  const classes = useStyles(),
    currentUser = app.auth().currentUser.displayName;

  // props const
  const ids = props.docsId,
    author = props.author,
    avatar = author.charAt(0),
    postContent = props.context,
    time = props.time,
    commnt = props.comment;


  //comment section
  const [comment, setComment] = useState('');

  const handleAddComment = () => {

    const commentAuthor = setCommentAuthorName(),
      commentContext = comment,
      userRef = app.firestore().collection('status').doc(`${ids}`),
      commentData = {
        author: commentAuthor,
        commentContext: commentContext
      };

    app.firestore().runTransaction(transaction => {
      return transaction.get(userRef).then(doc => {
        if (!doc.data().commentList) {
          transaction.set({
            commentList: [commentData]
          })
        } else {
          const commentNewList = doc.data().commentList;
          commentNewList.push(commentData);
          transaction.update(userRef, { commentList: commentNewList })
        }
      })
    })
      .then(() => console.log("Transaction successfully committed!"))
      .catch((error) => console.log("Transaction failed: ", error));

    setComment('')
  }

  const showCommentList = () => {

    return (
      commnt.map(({ author, commentContext }, id) => (
        <Comment
          key={id}
          author={author}
          commentContext={commentContext}
        />
      )).reverse()
    )
  }

  const handleLike = () => {

    console.log(`${ids} ${currentUser} I like it`)

    const userRef = app.firestore().collection('status').doc(`${ids}`);

    app.firestore().runTransaction(trans => {
      return trans.get(userRef).then(doc => {

        if (!doc.data().likes) {
          trans.set({
            likes: currentUser
          })
          // console.log(doc.data().likes)
        } else {
          const newLike = doc.data().likes;
          if ((newLike.indexOf(currentUser)) < 0) {
            newLike.push(currentUser);
            trans.update(userRef, { likes: newLike })
          } else {

          }
          // newLike.push(currentUser);
          // trans.update(userRef, { likes: newLike })
          // console.log(newLike.indexOf(currentUser))

        }
      })
    })
  }

  const userProfile = `/profile/${author}`;

  return (
    <div className={classes.root}>
      <Grid container
        direction="row"
        justify="center"
        alignItems="center">
        <Card className={classes.paper}>
          {/* header */}
          <Grid item xs={12}>
            <CardHeader
              avatar={
                <Avatar aria-label="recipe">
                  {avatar}
                </Avatar>
              }
              title={
                <Link
                  to={userProfile}
                  style={{
                    textDecoration: 'none',
                    color: '#757575'
                  }}>
                  {author}
                </Link>
              }
              subheader={time}
            />
          </Grid>
          {/* post content */}
          <Grid item xs={12}>
            <CardContent>
              <Typography variant="body2" color="textSecondary" component="p">
                {postContent}
              </Typography>
            </CardContent>
          </Grid>
          {/* like buttons */}
          <Grid item xs={12} style={{ marginLeft: '1rem' }}>
              {/* like ico */}
            <IconButton id='likeBtn' onClick={handleLike}>
              <FavoriteBorderOutlined style={{ color: '#BDBDBD' }} />
            </IconButton>
              {/* comment ico */}
            <IconButton >
              <InsertComment id='commentBtn' style={{ color: '#BDBDBD' }} />
            </IconButton>
            {
              (!commnt.length) ? '' : (
                <Typography variant="body2" component="span" className={classes.counter}>
                  {commnt.length}
                </Typography>
              )
            }
          </Grid>
          {/* add comment section */}
          <Grid item xs={12}>
            <CardActions disableSpacing>
              <ExpansionPanel className={classes.heading}>
                <ExpansionPanelSummary
                  aria-controls="panel1a-content"
                  id="panel1a-header">
                  <Typography component="span" style={{ fontSize: '1rem', marginLeft: 'auto' }}>Add comment</Typography>
                </ExpansionPanelSummary>
                <ExpansionPanelDetails>
                  <Typography component="div" style={{ width: '100%' }}>
                    <TextField className={classes.commentBar}
                      id="outlined-textarea"
                      label="Place your comment"
                      placeholder="Stop hate!"
                      multiline
                      variant="outlined"
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                    />
                    <Button
                      variant="outlined"
                      color="primary"
                      onClick={handleAddComment}>
                      Add
                    </Button>
                  </Typography>
                </ExpansionPanelDetails>
              </ExpansionPanel>
            </CardActions>
          </Grid>
          {/* comments- if they are */}
          <Typography component="div" className={classes.commentSection}>
            {
              showCommentList()
            }
          </Typography>
        </Card>
      </Grid>
    </div>
  )
}