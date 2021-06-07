import React from 'react';
import {StyleSheet, Text} from 'react-native';
import {weekdays, months} from 'constants/constants';

const FooterDateComponent = (props) => {
  const _formatTime = () => {
    const unix_timestamp = props.journalItem.node.timestamp;
    let date = new Date(unix_timestamp * 1000);

    let dayOfTheWeek = weekdays[date.getDay()];
    let dayOfTheMonth = date.getDate();
    let month = months[date.getMonth()];
    let year = date.getFullYear();
    let hours = date.getHours();
    let minutes = date.getMinutes();
    if (minutes < 10) minutes = '0' + minutes;

    let formattedTime =
      dayOfTheWeek +
      ' ' +
      dayOfTheMonth +
      ' ' +
      month +
      ' ' +
      year +
      ', ' +
      hours +
      ':' +
      minutes;

    return formattedTime;
  };
  return (
    <React.Fragment>
      <Text style={styles.text_date}>{_formatTime()}</Text>
    </React.Fragment>
  );
};
const styles = StyleSheet.create({
  text_date: {
    fontFamily: 'Merriweather-Light',
    color: 'gray',
    marginStart: 12,
    marginTop: 8,
  },
});
export default FooterDateComponent;
