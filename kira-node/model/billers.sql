create table BILLERS(
  "BILLER_ID" int unique not null primary key,
  "BILLER_NAME" varchar(50) unique not null,
  "SERVICE_ID" varchar(25) not null,
  "CODE" varchar(25) unique not null
);


insert into BILLERS (
  "BILLER_ID",
  "BILLER_NAME",
  "SERVICE_ID",
  "CODE"
)
values (
  1,
  'Eko Disco (PHCN)',
  1,
  'PHCNEKO'
);

insert into BILLERS (
  "BILLER_ID",
  "BILLER_NAME",
  "SERVICE_ID",
  "CODE"
)
values (
  2,
  'Ikeja Disco (PHCN)',
  1,
  'PHCNIKJ'
);

insert into BILLERS (
  "BILLER_ID",
  "BILLER_NAME",
  "SERVICE_ID",
  "CODE"
)
values (
  3,
  'DSTV',
  2,
  'DSTV'
);

insert into BILLERS (
  "BILLER_ID",
  "BILLER_NAME",
  "SERVICE_ID",
  "CODE"
)
values (
  4,
  'GOTV',
  2,
  'GOTV'
);

insert into BILLERS (
  "BILLER_ID",
  "BILLER_NAME",
  "SERVICE_ID",
  "CODE"
)
values (
  5,
  'SMILE',
  3,
  'SMILE'
);

insert into BILLERS (
  "BILLER_ID",
  "BILLER_NAME",
  "SERVICE_ID",
  "CODE"
)
values (
  6,
  'SWIFT',
  3,
  'SWIFT'
);
