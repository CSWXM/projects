const {Pool} = require('pg');

const pool = new Pool({
  host: 'localhost',
  port: 5432,
  database: process.env.POSTGRES_DB,
  user: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
});

exports.getMembers = async () => {
  const select =
    `SELECT * FROM member`;
  const query = {
    text: select,
    values: [],
  };
  const {rows} = await pool.query(query);
  // console.log(`rows: ${rows}`);
  return rows;
};

exports.getMailboxEmailArray = async (mailboxName, emailaddress) => {
  const select = `SELECT mail.identifier, mail.emailid, mail.fromName, 
                  mail.toName, mail.content, mail.sentTime, 
                  mail.receivedTime, mail.emailsubject 
                  FROM mail, mailbox 
                  WHERE mailbox.identifier = mail.identifier 
                    AND mailbox.mailboxname = $1 
                    AND mailbox.emailaddress = $2`;
  const query = {
    text: select,
    values: [mailboxName, emailaddress],
  };
  const {rows} = await pool.query(query);
  // const mailboxEmailArray = [];
  // for (const row of rows) {
  //   mailboxEmailArray.push([row.id, row.mail]);
  // }
  return rows;
};
