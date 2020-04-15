import React, { useState, useEffect } from 'react'
import Post from './Post'
import NoPostInfo from './NoPostInfo'
import { Typography } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles';
import { app } from "../config/base";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    width: 'auto',
    height: '65vh',
    overflowY: 'auto',
    overflowX: 'hidden',
  }
}));

export default function PostsList() {
  const classes = useStyles();

  const [post, setPostList] = useState(null);

  useEffect(() => {
    listenForPosts()
  }, [])
  // console.log(post)

  const listenForPosts = () => {
    app
      .firestore()
      .collection('status')
      .onSnapshot(snapshot => {
        const allPosts = []
        snapshot.forEach(doc => allPosts.push(doc.data()));
        setPostList(allPosts)
      }, (error) => console.error(error));
  }

  if (!post) {
    return (
      <>
        <NoPostInfo
          context='There is no post'
        />
      </>
    )
  }

  const renderPostList = () => {
    if (!post.length) {
      return (
        <>
          <NoPostInfo
            context='There is no post yet'
          />
        </>
      )
    }

    return post.map(({ author, context, time, id }) => (
      <Post
        key={id}
        docsId={id}
        author={author}
        context={context}
        time={time}
      // comment={comment}
      />
    )).reverse()
  }

  return (
    <React.Fragment>
      <Typography component="div" className={classes.root}>
        {
          renderPostList()
        }
      </Typography>
    </React.Fragment>
  )
}