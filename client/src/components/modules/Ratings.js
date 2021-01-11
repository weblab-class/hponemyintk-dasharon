// code from https://material-ui.com/components/rating/
import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Rating from '@material-ui/lab/Rating';
import StarBorderIcon from '@material-ui/icons/StarBorder';
import FavoriteIcon from '@material-ui/icons/Favorite';
import SentimentVeryDissatisfiedIcon from '@material-ui/icons/SentimentVeryDissatisfied';
import SentimentDissatisfiedIcon from '@material-ui/icons/SentimentDissatisfied';
import SentimentSatisfiedIcon from '@material-ui/icons/SentimentSatisfied';
import SentimentSatisfiedAltIcon from '@material-ui/icons/SentimentSatisfiedAltOutlined';
import SentimentVerySatisfiedIcon from '@material-ui/icons/SentimentVerySatisfied';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';

const StyledRating = withStyles({
  iconFilled: {
    color: '#ff6d75',
  },
  iconHover: {
    color: '#ff3d47',
  },
})(Rating);

export default function Ratings() {
  return (
    // <div>
    //   <Box component="fieldset" mb={3} borderColor="transparent">
    //     <Typography component="legend">Difficulty</Typography>
    //     <Rating
    //       name="customized-empty"
    //       defaultValue={2.5}
    //       precision={0.5}
    //       emptyIcon={<StarBorderIcon fontSize="inherit" />}
    //     />
    //   </Box>
    //   <Box component="fieldset" mb={3} borderColor="transparent">
    //     <Typography component="legend">Quality</Typography>
    //     <StyledRating
    //       name="customized-color"
    //       defaultValue={2.5}
    //       getLabelText={(value) => `${value} Heart${value !== 1 ? 's' : ''}`}
    //       precision={0.5}
    //       icon={<FavoriteIcon fontSize="inherit" />}
    //     />
    //   </Box>
    // </div>
    <>
        <Typography component="legend">Difficulty:</Typography>
        <Rating
          name="customized-empty"
          defaultValue={2.5}
          precision={0.5}
          emptyIcon={<StarBorderIcon fontSize="inherit" />}
        />

        <Typography component="legend">Quality:</Typography>
        <StyledRating
          name="customized-color"
          defaultValue={2.5}
          getLabelText={(value) => `${value} Heart${value !== 1 ? 's' : ''}`}
          precision={0.5}
          icon={<FavoriteIcon fontSize="inherit" />}
        />
    </>
  );
}
