import moment from "moment";
import React from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { toast } from "react-toastify";
import { Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import styled from "styled-components";
import { Button } from "./Button";
import { LoadingSpinner } from "./LoadingSpinner";
import { Popup } from "./Popup";

const HeadingWrapper = styled.div`
  display: flex;
  justify-content: space-between;
`;

const ContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin: 10px 0;
  height: 300px;
`;

const DateWrapper = styled.div`
  display: flex;
  justify-content: space-around;
  flex-wrap: wrap;
`;

const DatePickerPair = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
`;

const Colors = [
    "deepskyblue",
    "deeppink",
    "mediumseagreen",
];

/* The popup with the performance graph */
/*  Props:
 *  name - The name of the portfolio
 *  stocks - An array of the selected stocks that should be shown in the graph
 *  onClose - The action of the "Close" button
 */
export class PopupGraph extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            startDate: moment().add(-7, "days"), // The start date of the graph. I used the external library "moment" here because handling it is more elegant than the built-in Date object. Arbitrarily picked to be a week before today.
            endDate: moment(), // The end date for the graph. moment() returns the current date and time (today).
            historyData: [], // The history data array is empty before it has loaded from the API
            historyNumLoaded: 0, // The number of completed fetches, successful or not
            chartData: [], // The fetched data formatted in a way that the chart can read it easily
        };

        this.handleStartDate = this.handleStartDate.bind(this);
        this.handleEndDate = this.handleEndDate.bind(this);
        this.fetchHistory = this.fetchHistory.bind(this);
    }

    componentDidMount() {
        this.fetchHistory();
    }

    componentDidUpdate(prevProps, prevState) {
        // Reformat the chart data when more charts have been loaded or when the start and end dates have changed.
        // The chart library prefers a specific data structure, so the API data is converted
        if (prevState.historyNumLoaded !== this.state.historyNumLoaded || prevState.startDate !== this.state.startDate || prevState.endDate !== this.state.endDate) {
            let data = [];
            for (const key in this.state.historyData) {
                data = data.concat([this.state.historyData[key]]);
            }
            data = data
                .filter(item => moment(item.date) >= this.state.startDate.startOf("day") && moment(item.date) <= this.state.endDate.startOf("day"))
                .sort((a, b) => moment(a.date) - moment(b.date)); // Filter out any dates outside the given range and sort the results with the latest date last
            this.setState({chartData: data});
        }
    }

    render() {
        // I used the external library "Recharts" to draw the graph. It prefers its data in a certain format which is why I convert it.
        return (
            <Popup>
                <HeadingWrapper>
                Performance: {this.props.name} <Button label="Close" onClick={this.props.onClose} color="crimson" />
                </HeadingWrapper>
                <ContentWrapper>
                    {this.state.chartData.length !== 0 ?
                        <ResponsiveContainer width="100%" height={300}>
                            <LineChart data={this.state.chartData}>
                                <XAxis dataKey="date"/>
                                <YAxis unit="$"/>
                                <Legend />
                                <Tooltip unit="$" />
                                {Object.keys(this.props.stocks).map(key => (
                                    <Line
                                        key={key}
                                        dataKey={`${this.props.stocks[key].symbol}`}
                                        stroke={Colors[key]}
                                        dot={false}
                                    />
                                ))}
                            </LineChart>
                        </ResponsiveContainer>
                        :
                        (this.state.historyNumLoaded !== this.props.stocks.length ?
                            <LoadingSpinner size="100px"/>
                            :
                            <Button label="&nbsp;&#8635;&nbsp;Refresh" onClick={() => this.fetchHistory()} color="springgreen" />
                        )
                    }
                </ContentWrapper>

                <DateWrapper>
                    <DatePickerPair>
                        Start date: {/* I used the external library "react-datepicker" to make the date pickers */}
                        <DatePicker
                            selected={this.state.startDate.toDate()}
                            onChange={this.handleStartDate}
                            dateFormat="yyyy-MM-dd"
                            dropdownMode="scroll"
                        />
                    </DatePickerPair>
                    <DatePickerPair>
                        End date:
                        <DatePicker
                            selected={this.state.endDate.toDate()}
                            onChange={this.handleEndDate}
                            dateFormat="yyyy-MM-dd"
                            dropdownMode="scroll"
                        />
                    </DatePickerPair>
                </DateWrapper>
            </Popup>
        );
    }

    // This sets the start date to the picked start date as long as it's earlier than the end date
    handleStartDate(date) {
        if (this.state.endDate > moment(date)) {
            this.setState({startDate: moment(date)});
        } else {
            toast.warn("Start date must be earlier than the end date!"); // Fire a warning toast (react-toastify)
        }
    }

    // Sets the end date as long as it's later than the start date and not a future date
    handleEndDate(date) {
        if (moment(date) > moment()) {
            toast.warn("End date can not be a future date!")
        } else if (moment(date) <= this.state.startDate) {
            toast.warn("End date must be later than the start date!")
        } else {
            this.setState({endDate: moment(date)});
        }
    }

    // Fetches the weekly stock values for each of the given stocks' symbols using the Alpha Vantage API. Called when the PopupGraph mounts.
    fetchHistory() {
        this.setState({historyNumLoaded: 0});
        for (const stock of this.props.stocks) {
            fetch("https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol="+stock.symbol+"&outputsize=full&apikey="+process.env.REACT_APP_ALPHA_VANTAGE_API_KEY)
                .then(response => response.json())
                .then(
                    result => {
                        if ("Error Message" in result) { // This key only appears in the result JSON when an invalid symbol is given
                            this.setState({historyNumLoaded: this.state.historyNumLoaded+1});
                            toast.error("Invalid symbol!"); // Fire an error toast (uses the external library react-toastify)
                        } else if ("Note" in result) { // This key only appears in the result JSON when the API limit has been reached. The limit is five requests per minute and 500 per day.
                            this.setState({historyNumLoaded: this.state.historyNumLoaded+1});
                            toast.error("API limit reached. Please wait a minute and try again.");
                        } else {
                            const newHistoryData = this.state.historyData;
                            for (const date in result["Time Series (Daily)"]) {
                                if (!newHistoryData[date]) newHistoryData[date] = {date};
                                newHistoryData[date][stock.symbol] = result["Time Series (Daily)"][date]["4. close"];
                            }
                            this.setState({historyNumLoaded: this.state.historyNumLoaded+1, historyData: newHistoryData}); // Add the relevant received data to the historyData state variable.
                        }
                    },
                    error => {
                        this.setState({historyNumLoaded: this.state.historyNumLoaded+1});
                        toast.error(error);
                    }
                );
        }
    }
}