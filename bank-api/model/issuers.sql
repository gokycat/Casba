create table ISSUERS (
"ISSUER_ID" int unique not null primary key,
"ISSUER_NAME" varchar(50) unique not null
);


insert into ISSUERS (
  "ISSUER_ID",
  "ISSUER_NAME"
)
values (
  1,
  'Mastercard'
);

insert into ISSUERS (
  "ISSUER_ID",
  "ISSUER_NAME"
)
values (
  2,
  'Visa'
);

insert into ISSUERS (
  "ISSUER_ID",
  "ISSUER_NAME"
)
values (
  3,
  'Verve'
);

insert into ISSUERS (
  "ISSUER_ID",
  "ISSUER_NAME"
)
values (
  4,
  'American Express'
);

insert into ISSUERS (
  "ISSUER_ID",
  "ISSUER_NAME"
)
values (
  5,
  'Diners Club'
);
