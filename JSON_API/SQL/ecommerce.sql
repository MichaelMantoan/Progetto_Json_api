create database if not exists mantoan_michael_ecommerce;

create table if not exists   mantoan_michael_ecommerce.products
(
    id int not null auto_increment primary key,
    name varchar(50),
    price float,
    brand varchar(50)
);