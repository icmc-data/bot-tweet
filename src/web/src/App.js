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
import TweetCard from "./components/TweetCard/TweetCard";
import FormHelperText from "@material-ui/core/FormHelperText";
import bibliaIndexWord from "./assets/biblia/biblia-index_word.json";
import bibliaWordIndex from "./assets/biblia/biblia-word_index.json";
import PersonalityModelLoader from "./components/Tensorflow/PersonalityModelLoader"
import axios from "axios"


function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {/* {'Copyright © '} */}
      Made with <LocalCafe></LocalCafe> by {' '}
      <Link color="inherit" href="http://data.icmc.usp.br/">
        <strong style={{ textDecoration: 'underline' }}>Data ICMC</strong>
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
  },

}));

export default function App() {
  const classes = useStyles();

  const [selected, setSelected] = useState(0)

  const [charCount, setCharNumber] = useState(0)

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

  const [typingTimeout, setTypingTimeout] = useState(0)

  const [tweets, setTweets] = useState([]);

  const [curTweet, setCurTweet] = useState({author: 0, content: '', timeDate: ''})

  const generateTweet = () => {

    let tweetTime = generateTimeAndDate()

    let newTweet = {
        author: curTweet.author,
        content: curTweet.content,
        timeDate: tweetTime
    }

    setTweets([newTweet, ...tweets])

  }

  function deleteTweet(index){
    let newTweets = [...tweets]

    newTweets.splice(index, 1)

    setTweets([...newTweets])
  }

  const generateTimeAndDate = () => {
    var today = new Date();

    var date = today.getDate() + '-' + (today.getMonth()+1) + '-'
                + today.getFullYear();

    var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();

    return date + ' ' + time;

  }

  // Data fetching to predict the tweet from the Python Api endpoint.
  const predictTweet = (value) => {
    axios.post("http://localhost:1337/", { author: curTweet.author, content: value}).then((res) => {
      console.log("Response:", res.data)
    })
    clearTimeout(typingTimeout)
  }


  // Handles changes in the tweet field...
  const handleChange = (e) => {

    if (typingTimeout){
      clearTimeout(typingTimeout)
    }

    setCurTweet({ author: selected, content: e.target.value});

    const value = e.target.value;

    setTypingTimeout(setTimeout(function(){
      predictTweet(value)
    }, 1000))
  }

  // Handles the changes in the selected personality
  const handleSelection = (index) => {
    setSelected(index)
    setCurTweet({ author: index, content: curTweet.content})
  }


  useEffect(() => {
    let newCharCount = curTweet.content.length
    setCharNumber(newCharCount)
  }, [curTweet])


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
                            onChange={handleChange}
                            id="firstName"
                            // label="First Name"
                            autoFocus
                            multiline
                            rows='6'
                            inputProps={{
                                maxLength: 250
                            }}
                        />
                        <FormHelperText id="outlined-weight-helper-text">{charCount}/250</FormHelperText>
                    </CardContent>
                    <CardActions>
                        <Grid container direction="row"
                                justify="space-between"
                                alignItems="flex-end" spacing={3}>
                            <Grid item xs={6}>
                              {
                                personalities.map((persona, index) =>
                                   <IconButton
                                    onClick={() => handleSelection(index)}
                                    className={
                                      (index === selected) ?
                                        classes.selectedButton
                                      :
                                        ''}
                                    key={index}>
                                    <Avatar alt="Remy Sharp" src={persona.imgLink}  />
                                  </IconButton>
                                )
                              }

                            {/* </Grid> */}

                            {/* <Grid item xs={6} > */}
                                <Fab variant="extended" aria-label="tweet" className={classes.fab} onClick={generateTweet}>
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
          <Typography className={classes.title} component='div' gutterBottom>
            Timeline



            {
                tweets.map((tweet, index) => (
                    <div style={{margin: '2%'}} key={index}>

                        <TweetCard
                            avatar={personalities[tweet.author].imgLink}
                            content={tweet.content}
                            name={personalities[tweet.author].name}
                            timeDate={tweet.timeDate}
                            deleteTweet={(index) => deleteTweet(index)}
                            index={index}
                            // className={}
                        ></TweetCard>
                    </div>
                ))
            }
          </Typography>
        </CardContent>
      </Card>

      <Box mt={5}>
        <Copyright />
      </Box>
    </Container>
  );
}