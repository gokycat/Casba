create table ACCOUNT_TYPE (
"TYPE_ID" int unique not null primary key,
"TYPE_NAME" varchar(50) unique not null
);


insert into ACCOUNT_TYPE (
  "TYPE_ID",
  "TYPE_NAME"
)
values (
  1,
  'Savings'
);

insert into ACCOUNT_TYPE (
  "TYPE_ID",
  "TYPE_NAME"
)
values (
  2,
  'Current'
);

insert into ACCOUNT_TYPE (
  "TYPE_ID",
  "TYPE_NAME"
)
values (
  3,
  'Domicillary'
);
