import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import clsx from 'clsx';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Collapse from '@material-ui/core/Collapse';
import Avatar from '@material-ui/core/Avatar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import { red } from '@material-ui/core/colors';
import FavoriteIcon from '@material-ui/icons/Favorite';
import ShareIcon from '@material-ui/icons/Share';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import DeleteIcon from "@material-ui/icons/Delete";

const useStyles = makeStyles(theme => ({
  card: {
    // display: 'flex'
    // maxWidth: '500px'
  },
  media: {
    height: 0,
    paddingTop: '56.25%', // 16:9
  },
  expand: {
    transform: 'rotate(0deg)',
    marginLeft: 'auto',
    transition: theme.transitions.create('transform', {
      duration: theme.transitions.duration.shortest,
    }),
  },
  expandOpen: {
    transform: 'rotate(180deg)',
  },
  avatar: {
    backgroundColor: red[500],
  },
}));

export default function TweetCard(props) {

  const { avatar, content, name, timeDate, deleteTweet, index } = props;
  const classes = useStyles();

  const deletingThisTweet = () => {
    deleteTweet(index)
  }


  return (
    <Card className={classes.card} raised={true}>
      <CardHeader
        avatar={
          <Avatar aria-label="recipe" src={avatar} className={classes.avatar}>
          </Avatar>
        }
        action={
          <IconButton aria-label="settings" onClick={() => deletingThisTweet()}>
            <DeleteIcon color="error" />
          </IconButton>
        }
        title={name}
        subheader={timeDate}
      />

      <CardContent>
        <Typography variant="body2"  component="p">
          {content}
        </Typography>
      </CardContent>
      {/* <CardActions disableSpacing>
        <IconButton aria-label="add to favorites">
          <FavoriteIcon />
        </IconButton>
        <IconButton aria-label="share">
          <ShareIcon />
        </IconButton>
        <IconButton
          className={clsx(classes.expand, {
            [classes.expandOpen]: expanded,
          })}
          onClick={handleExpandClick}
          aria-expanded={expanded}
          aria-label="show more"
        >
          <ExpandMoreIcon />
        </IconButton>
      </CardActions> */}

    </Card>
  );
}
