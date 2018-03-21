create table BENEFICIARIES (
  "ACCOUNT_NO" bigint not null,
  "NAME" varchar(150) not null,
  "BANK_NAME" varchar(100) not null,
  "ACCOUNT_NO_REF" bigint not null,
  "TOC" bigint
);


insert into BENEFICIARIES (
  "ACCOUNT_NO",
  "NAME",
  "BANK_NAME",
  "ACCOUNT_NO_REF",
  "TOC"
)
values (
  0987654321,
  'Jane Doe',
  'access',
  1234567890,
  1516359805
);
