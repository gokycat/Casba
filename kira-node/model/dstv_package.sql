create table DSTV_PACKAGES (
"PACKAGE_ID" int unique not null primary key,
"PACKAGE_NAME" varchar(50) unique not null,
"AMOUNT" varchar(100) not null
);


insert into DSTV_PACKAGES (
  "PACKAGE_ID",
  "PACKAGE_NAME",
  "AMOUNT"
)
values (
  1,
  'Premium',
  '14700'
);

insert into DSTV_PACKAGES (
  "PACKAGE_ID",
  "PACKAGE_NAME",
  "AMOUNT"
)
values (
  2,
  'Compact Plus',
  '9900'
);

insert into DSTV_PACKAGES (
  "PACKAGE_ID",
  "PACKAGE_NAME",
  "AMOUNT"
)
values (
  3,
  'Compact',
  '6300'
);

insert into DSTV_PACKAGES (
  "PACKAGE_ID",
  "PACKAGE_NAME",
  "AMOUNT"
)
values (
  4,
  'Family',
  '3800'
);

insert into DSTV_PACKAGES (
  "PACKAGE_ID",
  "PACKAGE_NAME",
  "AMOUNT"
)
values (
  5,
  'Access',
  '1900'
);

insert into DSTV_PACKAGES (
  "PACKAGE_ID",
  "PACKAGE_NAME",
  "AMOUNT"
)
values (
  7,
  'FTA Plus',
  '1600'
);
