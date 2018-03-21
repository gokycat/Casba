create table TELCOS (
  "TELCO_ID" int unique not null primary key,
  "TELCO_NAME" varchar(50) unique not null,
  "CODE" varchar(25) unique not null
);


insert into TELCOS (
  "TELCO_ID",
  "TELCO_NAME",
  "CODE"
)
values (
  1,
  'mtn',
  '001'
);

insert into TELCOS (
  "TELCO_ID",
  "TELCO_NAME",
  "CODE"
)
values (
  2,
  'airtel',
  '002'
);

insert into TELCOS (
  "TELCO_ID",
  "TELCO_NAME",
  "CODE"
)
values (
  3,
  'glo',
  '003'
);

insert into TELCOS (
  "TELCO_ID",
  "TELCO_NAME",
  "CODE"
)
values (
  4,
  'etisalat',
  '004'
);

insert into TELCOS (
  "TELCO_ID",
  "TELCO_NAME",
  "CODE"
)
values (
  5,
  'visafone',
  '005'
);
