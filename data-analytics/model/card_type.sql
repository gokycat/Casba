create table CARD_TYPE (
"TYPE_ID" int unique not null primary key,
"TYPE_NAME" varchar(50) unique not null
);


insert into CARD_TYPE (
  "TYPE_ID",
  "TYPE_NAME"
)
values (
  1,
  'Credit'
);

insert into CARD_TYPE (
  "TYPE_ID",
  "TYPE_NAME"
)
values (
  2,
  'Debit'
);
