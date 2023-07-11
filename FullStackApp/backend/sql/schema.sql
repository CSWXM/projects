DROP TABLE IF EXISTS mail;
DROP TABLE IF EXISTS mailbox;
DROP TABLE IF EXISTS member;

CREATE TABLE member(memberName VARCHAR(32), emailAddress VARCHAR(32) UNIQUE PRIMARY KEY, memberPassword VARCHAR(64));

CREATE TABLE mailbox(emailAddress VARCHAR(32), identifier VARCHAR(36) UNIQUE PRIMARY KEY, mailboxName VARCHAR(32), FOREIGN KEY(emailAddress) REFERENCES member(emailAddress));

CREATE TABLE mail(identifier VARCHAR(36), emailid VARCHAR(36) UNIQUE PRIMARY KEY, fromName VARCHAR(32), toName VARCHAR(32), content jsonb, sentTime VARCHAR(27), receivedTime VARCHAR(27), emailsubject VARCHAR(64), FOREIGN KEY(identifier) REFERENCES mailbox(identifier));
