CREATE TABLE ACCOUNT (
  accountNo varchar(255) NOT NULL,
  bvn bigint,
  bank varchar(255),
  type varchar(255),
  balance bigint,
  ToC bigint,
  Primary Key(accountNo)
);

INSERT INTO ACCOUNT (ACCOUNTNO, BVN, BANK, TYPE, BALANCE, TOC) VALUES ('0694450099', 22182780033, 'Access', 'Savings', 6000, 1122334455);
INSERT INTO ACCOUNT (ACCOUNTNO, BVN, BANK, TYPE, BALANCE, TOC) VALUES ('0016749967', 22182780033, 'Stanbic', 'Current', 2000, 1234567654);
