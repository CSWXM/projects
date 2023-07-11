const db = require('./db');

// initialize the allMailboxes arrray
const allMailboxes = ['inbox', 'sent'];
// regex from: https://stackoverflow.com/questions/19989481/how-to-determine-if-a-string-is-a-valid-v4-uuid
// const uuidv4Regex =
//   /^[0-9A-F]{8}-[0-9A-F]{4}-4[0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i;

// /**
//  * validate email
//  * @param {string} mailAddr
//  * @return {bool} true of false
//  * from: https://www.w3resource.com/javascript/form/email-validation.php
//  */
// function validateEmail(mailAddr) {
//   if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
//     .test(mailAddr)) {
//     return (true);
//   }
//   return (false);
// }

// /**
//  * remove content
//  * @param {object} email
//  * @return {object} email without content prop
//  */
// function removeContent(email) {
//   const emailCpy = JSON.parse(JSON.stringify(email));
//   delete emailCpy.content;
//   return emailCpy;
// }

/**
 * Create mailboxArray
 * @param {bool | string} oneMailbox
 * @param {string} emailaddress
 * @return {Promise<array>}
 */
async function makeMailboxArray(oneMailbox, emailaddress) {
  let mailboxes;
  if (oneMailbox) {
    if (!allMailboxes.includes(oneMailbox)) {
      return undefined;
    }
    mailboxes = [`${oneMailbox}`];
  } else {
    mailboxes = allMailboxes;
  }
  const mailboxArray = [];
  for (const mailboxName of mailboxes) {
    const mailboxArrayItem = {'name': `${mailboxName}`, 'mail': []};
    const mailbox = await db.getMailboxEmailArray(mailboxName, emailaddress);
    // console.log(mailbox);
    for (email of mailbox) {
      mailboxArrayItem['mail'].push(email);
    }
    if (mailboxArrayItem['mail'].length > 0) {
      mailboxArray.push(mailboxArrayItem);
    }
  }
  return mailboxArray;
};

exports.getMailboxes = async (req, res) => {
  const {emailaddress} = req.user;
  let mailboxArray;
  if (req.query.mailbox !== undefined) {
    // console.log(
    //   `await makeMailboxArray(${req.query.mailbox}, ${emailaddress})`);
    mailboxArray = await makeMailboxArray(req.query.mailbox, emailaddress);
    // console.log(`mailboxArray: ${JSON.stringify(mailboxArray)}`);
    if (mailboxArray === undefined) {
      res.status(404).send();
    } else {
      res.status(200).send(mailboxArray);
    }
  } else {
    mailboxArray = await makeMailboxArray(false, emailaddress);
    res.status(200).send(mailboxArray);
  }
};

// exports.getById = async (req, res) => {
//   if (uuidv4Regex.test(req.params.id)) {
//     const email = await db.getEmailByID(req.params.id);
//     if (email) {
//       email[1].id = email[0];
//       res.status(200).send(email[1]);
//     } else {
//       res.status(404).send();
//     }
//   } else {
//     res.status(404).send();
//   }
// };

// exports.addToSent = async (req, res) => {
//   let badRequest = false;
//   for (const key of Object.keys(req.body)) {
//     if (!['to', 'subject', 'content'].includes(key)) {
//       badRequest = true;
//     }
//   }
//   if (badRequest) {
//     res.status(400).send();
//   } else {
//     // set id, received, from-name and from-email
//     const respEmail = {
//       'to': req.body['to'],
//       'from': {
//         'name': 'CSE186 Student',
//         'email': 'CSE186student@ucsc.edu',
//       },
//       'subject': req.body['subject'],
//       'sent': new Date().toISOString(),
//       'received': new Date().toISOString(),
//       'content': req.body['content'],
//     };
//     // WRITE EMAIL TO MAP, WRITE MAILBOX TO DISK
//     const insertedCol = await db.postEmailToSent(respEmail);
//     respEmail['id'] = insertedCol[0];
//     // send response with respEmail
//     res.status(201).send(respEmail);
//   }
// };

// exports.moveEmail = async (req, res) => {
//   let rowOfID = [false, false, false];
//   if (uuidv4Regex.test(req.params.id)) {
//     rowOfID = await db.getRowOfID(req.params.id);
//   }
//   if (!rowOfID[1]) {
//     res.status(404).send();
//   } else if (rowOfID[1] !== 'sent' && req.query.mailbox === 'sent') {
//     res.status(409).send();
//   } else if (rowOfID[1] === 'sent' && req.query.mailbox === 'sent') {
//     res.status(204).send();
//   } else {
//     // REMOVE EMAIL FROM MAP, WRITE MAILBOX TO DISK
//     await db.deleteEmailbyId(rowOfID[0]);
//     // ADD EMAIL MAP, WRITE MAILBOX TO DISK
//     if (!allMailboxes.includes(req.query.mailbox)) {
//       allMailboxes.push(req.query.mailbox);
//     }
//     await db.putEmailInMailbox(rowOfID[0], req.query.mailbox, rowOfID[2]);
//     res.status(204).send();
//   }
// };
