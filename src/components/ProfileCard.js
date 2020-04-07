import * as React from 'react';
import { useState } from 'react';
import FullWidthTabs from './ProfileTab';
import { Grid, Paper, Button, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import logo from './img/1ok.jpg'
import { app } from "../config/base";

const displayButton = () => {
  const userId = app.auth().currentUser.uid

  if (userId === userId) {
    return (
      <Button variant="outlined" color="primary" disabled>
        Follow
      </Button>
    )
  } else {
    return (
      <Button variant="outlined" color="primary">
        Follow
      </Button>
    )
  }
}

const userName = () => {
    const userName = app.auth().currentUser.displayName;
    return userName;
}

const joinDate = () => {
  const joinDate = app.auth().currentUser.metadata.creationTime;
  const creationDate = joinDate.slice(4,16);

  return creationDate;
}

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  paper: {
    padding: theme.spacing(2),
    margin: '1rem auto',
    width: '70vh'
  },
  image: {
    width: 80,
    height: 80,
  },
  profile: {
    textAlign: 'center',
  },
  about: {
    borderBottom: '1px solid #3F51B5',
  }
}));

export default function ProfileCard() {
  const classes = useStyles();
  const [about, setAbout] = useState('Click to edit');
  const [edit, setEdit] = useState(false)

  const handleEdit = () => {
    setEdit(!edit)
  }

  const handleAbout = (e) => {
    setAbout(e.target.value)
  }

  const field = () => {
    if (!edit) {
      return (
        <Typography
          component="p"
          style={{ padding: '1.5rem' }
          }
        >
          {about}
        </Typography >
      )
    } else {
      return (
        <Typography
          component="input"
          style={{ padding: '1.5rem' }}
          value={about}
          onChange={handleAbout}
        />
      )
    }
  }

  
  return (
    <div className={classes.root}>
      <Paper className={classes.paper}>
        <Grid container spacing={2}>
          {/* My profile */}
          <Grid item xs={12} className={classes.profile}>
            <Typography variant="h6" style={{ borderBottom: '1px solid #3F51B5' }}>
              My profile
            </Typography>
          </Grid>
          {/* Image and Name */}
          <Grid item xs={6}
            container
            direction="row"
            justify="center"
            alignItems="center">
            <Grid item xs={6}>
              <img className={classes.image} alt="logo" src={logo} />
            </Grid>
            <Grid item xs={6}>
              <Typography variant="h5">
                {userName()}
            </Typography>
            </Grid>
          </Grid>
          {/* Follow BTN */}
          <Grid item xs={6}
            container
            direction="row"
            justify="flex-end"
            alignItems="center">
            {displayButton()}
            <Button variant="outlined" color="secondary" onClick={handleEdit}>
              Edit
            </Button>
          </Grid>
          {/* About me head */}
          <Grid item xs={6} className={classes.about}>
            <Typography variant="h6">
              About me:
            </Typography>
          </Grid>
          {/* Join Date */}
          <Grid item xs={6}
            container
            direction="row"
            justify="flex-end">
            <Typography component="span" style={{ fontSize: '0.7rem' }}>
              Joined: {joinDate()}
            </Typography>
          </Grid>
          {/* About me TEXT */}
          <Grid item xs={12}>

            {field()}

          </Grid>
          {/* Tab */}
          <FullWidthTabs />
        </Grid>
      </Paper>
    </div>
  )
}