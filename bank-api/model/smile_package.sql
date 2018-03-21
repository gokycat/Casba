create table SMILE_PACKAGES (
"PACKAGE_ID" int unique not null primary key,
"PACKAGE_NAME" varchar(50) unique not null,
"AMOUNT" varchar(100) not null
);


insert into SMILE_PACKAGES (
  "PACKAGE_ID",
  "PACKAGE_NAME",
  "AMOUNT"
)
values (
  1,
  'Unlimited',
  '19800'
);

insert into SMILE_PACKAGES (
  "PACKAGE_ID",
  "PACKAGE_NAME",
  "AMOUNT"
)
values (
  2,
  '10GB',
  '9000'
);

insert into SMILE_PACKAGES (
  "PACKAGE_ID",
  "PACKAGE_NAME",
  "AMOUNT"
)
values (
  3,
  '15GB',
  '1000'
);

insert into SMILE_PACKAGES (
  "PACKAGE_ID",
  "PACKAGE_NAME",
  "AMOUNT"
)
values (
  4,
  '1GB',
  '1000'
);
