CREATE DATABASE reporting
    WITH 
    ENCODING = 'UTF8';
\c reporting
CREATE SCHEMA reporting;
CREATE TABLE reporting.Custom_Query( 
	Custom_Query_ID SERIAL PRIMARY KEY,
	Query_Name VARCHAR(100) NOT NULL,
	Created_By_ID INT NOT NULL,
	Create_Date TIMESTAMP DEFAULT current_timestamp,
	Updated_By_ID INT NOT NULL,
	Update_Date TIMESTAMP NOT NULL,
	Query_Parameters TEXT NOT NULL,
	Valid BOOLEAN NOT NULL
);
CREATE USER reporting WITH PASSWORD 'reporting';
GRANT USAGE ON SCHEMA reporting TO reporting;
GRANT SELECT, INSERT, UPDATE ON ALL TABLES IN SCHEMA reporting TO reporting;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA reporting TO reporting;

