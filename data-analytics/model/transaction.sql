CREATE TABLE TRANSACTION (
  transID varchar(255) NOT NULL,
  bvn bigint,
  accountNo varchar(255),
  recipient varchar(255),
  amount bigint,
  ToC bigint,
  Primary Key(transID)
);

INSERT INTO TRANSACTION (TRANSID, BVN, ACCOUNTNO, RECIPIENT, AMOUNT, TOC) VALUES ('JE000001', 22182780033, '0694450099', 'Housing', 25000, 1122334455);
INSERT INTO TRANSACTION (TRANSID, BVN, ACCOUNTNO, RECIPIENT, AMOUNT, TOC) VALUES ('JE000002', 22182780033, '0016749967', 'Transport', 9000, 1122334456);
INSERT INTO TRANSACTION (TRANSID, BVN, ACCOUNTNO, RECIPIENT, AMOUNT, TOC) VALUES ('JE000003', 22182780033, '0016749967', 'Food', 15000, 1122334457);
INSERT INTO TRANSACTION (TRANSID, BVN, ACCOUNTNO, RECIPIENT, AMOUNT, TOC) VALUES ('JE000004', 22182780033, '0694450099', 'Utility', 5000, 1122334458);
INSERT INTO TRANSACTION (TRANSID, BVN, ACCOUNTNO, RECIPIENT, AMOUNT, TOC) VALUES ('JE000005', 22182780033, '0016749967', 'Health', 10000, 1122334459);
