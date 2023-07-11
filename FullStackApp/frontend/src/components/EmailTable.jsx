import React from 'react';
// import emails from './data/emails.json';
// import loader from './data/loader';
import MyContext from './MyContext';
import './EmailTable.css';
// import DeskViewBox from './DeskViewBox';

/**
 * Email table component
 * @return {object} JSX
 */
function EmailTable() {
  /**
   * https://stackoverflow.com/questions/2536379/difference-in-months-between-two-dates-in-javascript
   * get num months difference
   * @param {date} d1
   * @param {date} d2
   * @return {int}
   */
  function monthDiff(d1, d2) {
    let months;
    months = (d2.getFullYear() - d1.getFullYear()) * 12;
    months -= d1.getMonth();
    months += d2.getMonth();
    return months;
  }
  /**
   * Format email dates
   * @param {string} dateStr
   * @param {string} emailsubject
   * @return {string} formated string
   */
  function formatDate(dateStr, emailsubject) {
    // console.log(dateStr, emailsubject);
    const monthsArr = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
      'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const myDate = new Date(dateStr);
    const todayDate = new Date();
    if (myDate.getDate() === todayDate.getDate() &&
    myDate.getFullYear() === todayDate.getFullYear() &&
    myDate.getMonth() === todayDate.getMonth()) {
      let myHours = myDate.getHours();
      // myHours = (myHours < 10 ? '0'+parseInt(myHours) : parseInt(myHours));
      myHours = (parseInt(myHours));
      let myMinutes = myDate.getMinutes();
      myMinutes = (parseInt(myMinutes));
      // (myMinutes < 10 ? '0'+parseInt(myMinutes) : parseInt(myMinutes));
      return `${myHours}:${myMinutes}`;
    } else if (monthDiff(myDate, todayDate) <= 12) {
      let myDayNum = myDate.getDate();
      // myDayNum = (myDayNum < 10 ? '0'+parseInt(myDayNum) :
      // parseInt(myDayNum));
      myDayNum = (parseInt(myDayNum));
      // console.log(`${myDate.toISOString()} ${myDate.getDate()}`);
      return `${monthsArr[myDate.getMonth()]} ${myDayNum}`;
    } else {
      return `${myDate.getFullYear()}`;
    }
  }

  /**
   * Format email dates
   * @param {JSON} emails
   * @param {string} mailbox
   * @return {array} formated string
   */
  function createTableRows(emails) {
    const trArr = [];
    // console.log(`emails: ${JSON.stringify(emails)}`);
    // if (emails.length !== 0) {
    const emailsPure = emails[0]['mail'];
    // console.log(`emailsPure: ${JSON.stringify(emailsPure)}`);
    for (const email of emailsPure) {
      trArr.push(
        <tr key={email['emailid']} id={email['emailid']}
          datestr={email['receivedtime']}>
          <td>{email['fromname']}</td>
          <td>{email['emailsubject']}</td>
          <td>{email['content']['message']}</td>
          <td>{formatDate(email['receivedtime'], email['emailsubject'])}</td>
        </tr>);
    }
    // }
    return trArr;
  }

  return (
    <MyContext.Consumer>
      {({setEmails, emails, setMailbox, mailbox}) => (
        <table>
          <thead>
            <tr>
              <th>From</th>
              <th>Subject</th>
              <th>Content</th>
              <th>Received</th>
            </tr>
          </thead>
          <tbody>
            {createTableRows(emails).sort((a, b) => {
              const aDate = new Date(a.props.datestr);
              const bDate = new Date(b.props.datestr);
              return (aDate.getTime() < bDate.getTime() ? 1 : -1);
            })}
          </tbody>
        </table>
        // {/* {(viewBoxOpen ? <DeskViewBox/> : null)} */}
      )}
    </MyContext.Consumer>
  );
}

export default EmailTable;
