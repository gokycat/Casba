create table CARDS (
"CARD_NO" bigint unique not null primary key,
"ACCOUNT_NO" bigint unique not null,
"BVN" bigint not null,
"ISSUER_ID" int not null,
"TYPE_ID" int not null,
"EXPIRY_MONTH" varchar(15) not null,
"EXPIRY_YEAR" varchar(15) not null,
"TOC" bigint,
 CONSTRAINT ACCOUNT_FK FOREIGN key ("ACCOUNT_NO") references ACCOUNTS ("ACCOUNT_NO") NOT ENFORCED,
 CONSTRAINT USER_FK FOREIGN key ("BVN") references USERS ("BVN") NOT ENFORCED,
 CONSTRAINT ISSUER_FK FOREIGN key ("ISSUER_ID") references ISSUERS ("ISSUER_ID") NOT ENFORCED,
 CONSTRAINT TYPE_FK FOREIGN key ("TYPE_ID") references CARD_TYPE ("TYPE_ID") NOT ENFORCED
);


insert into CARDS (
  "CARD_NO",
  "ACCOUNT_NO",
  "BVN",
  "ISSUER_ID",
  "TYPE_ID",
  "EXPIRY_MONTH",
  "EXPIRY_YEAR",
  "TOC"
)
values (
  1234567890987654,
  1234567890,
  12345678901,
  1,
  1,
  'Feb',
  '2019',
  1516359805
);
