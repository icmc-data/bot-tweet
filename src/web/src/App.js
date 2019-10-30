import React, { useState, useEffect } from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import IconButton from '@material-ui/core/IconButton';
import InputAdornment from '@material-ui/core/InputAdornment'
import AccountCircle from '@material-ui/icons/AccountCircle';
import LocalCafe from "@material-ui/icons/LocalCafe";
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Divider from '@material-ui/core/Divider';
import Fab from '@material-ui/core/Fab';
import Twitter from "@material-ui/icons/Twitter";


function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {/* {'Copyright © '} */}
      Made with <LocalCafe></LocalCafe> by {' '}
      <Link color="inherit" href="http://data.icmc.usp.br/">
        Data ICMC
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

const useStyles = makeStyles(theme => ({
  '@global': {
    body: {
      backgroundColor: '#e6ecf0',
    },
  },
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    width: '100%'
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(3),
  },

  fab: {
    margin: theme.spacing(2),
    // backgroundColor: '#',
    // color: '#ffffff'
  },
  extendedIcon: {
    marginRight: theme.spacing(1),

  },
  timeLine: {
    paddingTop: theme.spacing(5),
    paddingBottom: theme.spacing(2),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  title: {
    fontSize: 34,
  },
  selectedButton: {
    backgroundColor: '#1DA1F2'
  }



}));

export default function App() {
  const classes = useStyles();

  const [selected, setSelected] = useState(0)

  const [personalities, setPersonality] = useState([{
    name: 'Donald Trump',
    imgLink: 'https://pbs.twimg.com/profile_images/874276197357596672/kUuht00m_400x400.jpg',
    selected: false
  },
  {
    name: 'Brás Cubas',
    imgLink: 'http://lounge.obviousmag.org/yo_hablo/2016/05/30/1.jpg',
    selected: false
  }])



  const [tweets, setTweet] = useState([]);

  return (
    <Container component="main" >
      {/* <CssBaseline /> */}
      <div className={classes.paper}>
        {/* <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar> */}
        <Typography  component="h1" variant="h1">
          deep_tweet
        </Typography>

        <form className={classes.form} noValidate>
          <Grid container spacing={2}>
            <Grid container justify="center" alignItems="center" >
                {/* <IconButton>
                    <Avatar alt="Remy Sharp" src="https://pbs.twimg.com/profile_images/874276197357596672/kUuht00m_400x400.jpg"  />
                </IconButton>

                <IconButton>
                    <Avatar alt="Remy Sharp" src="http://lounge.obviousmag.org/yo_hablo/2016/05/30/1.jpg"  />
                </IconButton> */}
            </Grid>


            <Grid item xs={12} >
                <Card className={classes.card}>
                    <CardContent>
                        <TextField
                            autoComplete="fname"
                            name="firstName"
                            variant="outlined"
                            // required
                            fullWidth

                            id="firstName"
                            // label="First Name"
                            autoFocus
                            multiline
                            rows='6'

                        />
                    </CardContent>
                    <CardActions>
                        <Grid container direction="row"
                                justify="space-between"
                                alignItems="flex-end" spacing={3}>
                            <Grid item xs={6}>
                              {
                                personalities.map((persona, index) =>
                                   <IconButton
                                    onClick={() => setSelected(index)}
                                    className={
                                      (index === selected) ?
                                        classes.selectedButton
                                      :
                                        {}}>
                                    <Avatar alt="Remy Sharp" src={persona.imgLink}  />
                                  </IconButton>
                                )
                              }

                            {/* </Grid> */}

                            {/* <Grid item xs={6} > */}
                                <Fab variant="extended" aria-label="tweet" className={classes.fab}>
                                    <Twitter className={classes.extendedIcon}></Twitter>
                                    Tweetar
                                </Fab>
                            </Grid>

                        </Grid>


                    </CardActions>
                </Card>
            </Grid>
          </Grid>

        </form>
      </div>

      <Typography className={classes.timeLine} component="h2" variant="h3">

      </Typography>

      <Card className={classes.card}>
        <CardContent>
          <Typography className={classes.title}  gutterBottom>
            Timeline
          </Typography>
        </CardContent>
      </Card>

      <Box mt={5}>
        <Copyright />
      </Box>
    </Container>
  );
}