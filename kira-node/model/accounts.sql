create table ACCOUNTS (
  "ACCOUNT_NO" bigint unique not null primary key,
  "BANK_ID" int not null,
  "BVN" bigint not null,
  "TYPE_ID" int not null,
  "SPEND" bigint not null,
  "DESCRIPTION" varchar(150),
  "TOC" bigint,
  constraint BVN_FK foreign key ("BVN") references USERS ("BVN") not ENFORCED,
  constraint BANK_FK foreign key ("BANK_ID") references BANKS ("BANK_ID") not ENFORCED,
  constraint ACCOUNT_TYPE_FK foreign key ("TYPE_ID") references ACCOUNT_TYPE ("TYPE_ID") not ENFORCED
);


insert into ACCOUNTS (
  "ACCOUNT_NO",
  "BANK_ID",
  "BVN",
  "TYPE_ID",
  "SPEND",
  "DESCRIPTION",
  "TOC"
)
values (
  1234567890,
  1,
  12345678901,
  1,
  10000,
  'Everyday',
  1516359805
);
