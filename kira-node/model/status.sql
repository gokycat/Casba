create table STATUS (
  "STATUS_ID" int unique not null primary key,
  "CATEGORY" varchar(25) unique not null
);


insert into STATUS (
  "STATUS_ID",
  "CATEGORY"
)
values (
  1,
  'Inactive'
);

insert into STATUS (
  "STATUS_ID",
  "CATEGORY"
)
values (
  2,
  'Active'
);

insert into STATUS (
  "STATUS_ID",
  "CATEGORY"
)
values (
  3,
  'Disabled'
);
