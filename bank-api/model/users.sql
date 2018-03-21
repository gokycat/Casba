create table USERS (
  "BVN" bigint unique not null primary key,
  "EMAIL" varchar(50) unique not null,
  "PHONE" varchar(25) unique not null,
  "FIRST_NAME" varchar(50) not null,
  "MIDDLE_NAME" varchar(50),
  "LAST_NAME" varchar(50) not null,
  "DATE_OF_BIRTH" varchar(15) not null,
  "STATUS_ID" int not null,
  "HASH" varchar(255) not null,
  "PASSWORD" varchar(255) not null,
  "TOC" bigint,
  "LAST_SIGNIN" bigint,
  constraint STATUS_FK foreign key ("STATUS_ID") references STATUS ("STATUS_ID") not ENFORCED
);


insert into USERS (
  "BVN",
  "EMAIL",
  "PHONE",
  "FIRST_NAME",
  "MIDDLE_NAME",
  "LAST_NAME",
  "DATE_OF_BIRTH",
  "STATUS_ID",
  "HASH",
  "PASSWORD",
  "TOC",
  "LAST_SIGNIN"
)
values (
  12345678901,
  'johndoe@josla.com.ng',
  '08012345678',
  'John',
  'Unkown',
  'Doe',
  '04-MAY-2015',
  1,
  'B5cfLh7NBCxtb1nX',
  'qwerty',
  1516359805,
  1516359805
);
