import React, {PropTypes} from 'react';
import RaisedButton from 'material-ui/RaisedButton';
import TweetButton from './TweetButton';
import {Card, CardHeader, CardText} from 'material-ui/Card';
import {Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn} from 'material-ui/Table';

function getTweetText(url, slowerPagesPercent) {
    const webPerfChallengeUrl = 'https://webperfchallenge.com/?url=' + url;
    return `My website performs better than ${slowerPagesPercent} % of 50 most popular sites. ${webPerfChallengeUrl}`;
}

export default function ResultBox(props) {

    let slowerPagesPercentage = 100 / props.topSites.length * props.slowerPages.length;
    slowerPagesPercentage = Math.ceil(slowerPagesPercentage);

    return (
        <div className="result card">
            <div className="result-description">
                <Card>
                    <CardText>
                        <div className="result-content">
                            <div className="result-content-text">
                                Your Google Page Speed Score is: <a target="_blank"
                                                                    href={`https://developers.google.com/speed/pagespeed/insights/?url=${props.url}&tab=mobile`}>{props.speed}</a>
                                <br/><br/>
                                Your website performs better or equal to {slowerPagesPercentage}% of top 50 most popular websites.
                            </div>
                            <div>
                                <TweetButton
                                    label={'Tweet score'}
                                    tweetText={getTweetText(props.url, slowerPagesPercentage)}
                                    style={{marginRight: '5px'}}
                                />
                                <RaisedButton secondary label="Check another website" onClick={props.checkOtherWebsite}/>
                            </div>
                        </div>
                    </CardText>
                </Card>
            </div>
            <div className="result-table">
                <Card>
                    <CardHeader title="Most popular websites and their scores"/>

                    <Table allRowsSelected={false} selectable={false} className="overview">
                        <TableHeader adjustForCheckbox={false} displaySelectAll={false}>
                            <TableRow>
                                <TableHeaderColumn>site</TableHeaderColumn>
                                <TableHeaderColumn>mobile score</TableHeaderColumn>
                            </TableRow>
                        </TableHeader>
                        <TableBody displayRowCheckbox={false}>
                            {props.topSites.map((entry, idx) => {
                                return (
                                    <TableRow key={idx}>
                                        <TableRowColumn>{entry.site}</TableRowColumn>
                                        <TableRowColumn>{entry.mobile}</TableRowColumn>
                                    </TableRow>
                                );
                            })}
                        </TableBody>
                    </Table>
                </Card>
            </div>
        </div>
    );
}

ResultBox.propTypes = {
    topSites: PropTypes.array.isRequired,
    slowerPages: PropTypes.array.isRequired,
    speed: PropTypes.number.isRequired,
    checkOtherWebsite: PropTypes.func.isRequired,
    url: PropTypes.string.isRequired,
};

