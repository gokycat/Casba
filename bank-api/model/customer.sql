CREATE TABLE CUSTOMER (
  bvn bigint NOT NULL,
  first_name varchar(255),
  last_name varchar(255),
  email varchar(255),
  phone varchar(255),
  dob varchar(255),
  password varchar(255),
  ToC bigint,
  Primary Key(bvn)
);

INSERT INTO CUSTOMER (BVN, FIRST_NAME, LAST_NAME, EMAIL, PHONE, DOB, PASSWORD, TOC) VALUES (12345678901, 'John', 'Doe', 'johndoe@email.com', '080123456789', '04/05/2015', 'dinosaurs', 1122334455);
