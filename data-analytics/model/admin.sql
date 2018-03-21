create table ADMIN (
  "EMAIL" varchar(50) unique not null,
  "PHONE" varchar(25) unique not null,
  "FIRST_NAME" varchar(50) not null,
  "LAST_NAME" varchar(50) not null,
  "CASBA_ID" varchar(25) not null,
  "PASSWORD" varchar(100) not null
);


insert into ADMIN (
  "EMAIL",
  "PHONE",
  "FIRST_NAME",
  "LAST_NAME",
  "CASBA_ID",
  "PASSWORD"
)
values (
  'akinlabiajelabi@josla.com.ng',
  '08083718137',
  'Akinlabi',
  'Ajelabi',
  'JE001',
  'JamesPotter88'
);


insert into ADMIN (
  "EMAIL",
  "PHONE",
  "FIRST_NAME",
  "LAST_NAME",
  "CASBA_ID",
  "PASSWORD"
)
values (
  'babatundeadeniyi@josla.com.ng',
  '08110426911‬',
  'Babatunde',
  'Adeniyi',
  'JE003',
  'JoslaNigeria1'
);

insert into ADMIN (
  "EMAIL",
  "PHONE",
  "FIRST_NAME",
  "LAST_NAME",
  "CASBA_ID",
  "PASSWORD"
)
values (
  'michaelkolawole@josla.com.ng',
  '08169998366',
  'Michael',
  'Kolawole',
  'JE007',
  'Kunlex007'
);
