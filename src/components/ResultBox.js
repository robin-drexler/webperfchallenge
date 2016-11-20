import React, {PropTypes} from 'react';
import RaisedButton from 'material-ui/RaisedButton';
import {Card, CardHeader, CardText} from 'material-ui/Card';
import {Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn} from 'material-ui/Table';

export default function ResultBox(props) {

    let betterPagesPercentage = 100 / props.topSites.length * props.betterPages.length;
    betterPagesPercentage = Math.ceil(betterPagesPercentage);

    return (
        <div className="result card" key="result">
            <div className="result-description">
                <Card>
                    <CardText>
                        <div className="result-content">
                            <div className="result-content-text">
                                Your Google Page Speed Score is: <a target="_blank"
                                                                    href={`https://developers.google.com/speed/pagespeed/insights/?url=${props.url}&tab=mobile`}>{props.speed}</a>
                                <br/><br/>
                                {betterPagesPercentage}% of top 50 most popular websites perform better than
                                your site.
                            </div>
                            <div>
                                <RaisedButton primary label="Get help" onClick={props.getHelp}/>
                            </div>
                        </div>
                    </CardText>
                </Card>
            </div>
            <div className="result-table">
                <Card>
                    <CardHeader title="Top sites performing better than yours"/>

                    <Table allRowsSelected={false} selectable={false} className="overview">
                        <TableHeader adjustForCheckbox={false} displaySelectAll={false}>
                            <TableRow>
                                <TableHeaderColumn>site</TableHeaderColumn>
                                <TableHeaderColumn>mobile score</TableHeaderColumn>
                            </TableRow>
                        </TableHeader>
                        <TableBody displayRowCheckbox={false}>
                            {props.betterPages.map((entry, idx) => {
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
    betterPages: PropTypes.array.isRequired,
    speed: PropTypes.number.isRequired,
    getHelp: PropTypes.func.isRequired,
};

