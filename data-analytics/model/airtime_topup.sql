create table AIRTIME_TOPUP (
  "ID" bigint unique not null primary key,
  "BVN" bigint not null,
  "ACCOUNT_NO" bigint not null,
  "TELCO_NAME" varchar(150) not null,
  "AMOUNT" varchar(255) not null,
  "SESSION" bigint not null,
  "REFERENCE" bigint not null,
  "ESACODE" bigint not null,
  "PASSCODE" bigint not null,
  "BANKIT" varchar(150) not null,
  "SWITCHIT" varchar(150) not null,
  "TOC" bigint,
  "STATUS" int,
  constraint BVN_FK foreign key ("BVN") references USERS ("BVN") not ENFORCED,
  CONSTRAINT ACCOUNT_FK FOREIGN key ("ACCOUNT_NO") references ACCOUNTS ("ACCOUNT_NO") NOT ENFORCED,
  CONSTRAINT TELCO_FK FOREIGN key ("TELCO_NAME") references TELCOS ("TELCO_NAME") NOT ENFORCED
);


insert into AIRTIME_TOPUP (
  "ID",
  "BVN",
  "ACCOUNT_NO",
  "TELCO_NAME",
  "AMOUNT",
  "SESSION",
  "REFERENCE",
  "ESACODE",
  "PASSCODE",
  "BANKIT",
  "SWITCHIT",
  "TOC",
  "STATUS"
)
values (
  1,
  12345678901,
  1234567890,
  'airtel',
  '100.00',
  6296644960531706,
  3524199609184694,
  56586185,
  12345678,
  'Z',
  '200',
  1516359805,
  1
);
