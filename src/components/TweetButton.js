import React, {PropTypes} from 'react';
import RaisedButton from 'material-ui/RaisedButton';


function redirectToTwitter(text) {
    window.location.href = `https://twitter.com/intent/tweet?text=${window.encodeURIComponent(text)}`;
}

export default function TweetButton(props) {
    return (
      <RaisedButton
        primary
        onClick={() => {
            redirectToTwitter(props.tweetText);
        }}
        label={props.label}
        style={props.style}
      />
    );
}
TweetButton.propTypes = {
    label: PropTypes.string.isRequired,
    tweetText: PropTypes.string.isRequired,
    style: PropTypes.object
};

TweetButton.defaultProps = {
    style: {},
};