CREATE TABLE users (
	us_id serial,
	us_login varchar(35),
	us_password varchar(254),
	PRIMARY KEY (us_id)
);

CREATE TABLE roles (
	ro_id serial,
	ro_name varchar(35),
	PRIMARY KEY (ro_id)
);

CREATE TABLE user_roles (
	ur_id serial,
	ur_us_id integer REFERENCES users,
	ur_ro_id integer REFERENCES roles,
	PRIMARY key (ur_id)
);

CREATE UNIQUE INDEX user_roles_idx1 ON user_roles (ur_us_id, ur_ro_id);

INSERT INTO roles (ro_id, ro_name) VALUES (1, 'ROLE_USER');
