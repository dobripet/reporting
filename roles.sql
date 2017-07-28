select u.Name, r.Description, td.Name, td.Description, tt.Code
FROM dciowner.Users u 
	INNER JOIN dciowner.User_Roles ur ON u.ID = ur.User_ID 
	INNER JOIN dciowner.Roles r ON ur.Role_ID = r.ID 
	INNER JOIN dciowner.Transactions_For_Role tfr ON r.ID = tfr.Role_ID
	INNER JOIN dciowner.Transaction_Definitions td ON tfr.Transaction_Definition_ID = td.ID 
	INNER JOIN dciowner.Transaction_Types tt ON td.Transaction_Type_ID = tt.ID 
