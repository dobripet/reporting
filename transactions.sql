use dci_data;
select

top 1000

	-- Transactions columns
	ST.State, ST.Required_Quantity, ST.Confirmed_Quantity, ST.Quantity,
	ST.Start_Time, ST.Stop_Time, ST.Create_Date, ST.Direction, ST.Quantity_UM_Code, 

	-- Locations columns
	L.[Company_ID],
	L.[ID] as Comp_Location_ID,
	L.[Loc_Code] as Comp_Location_Code,

	-- Transactions_Definitions columns
	TD.[Transaction_Code] as Transaction_Code,
	TD.[Comp_Location_ID] as Location_ID,
	TD.[Description] as transDef_Description, 
	TD.[Transaction_Type_ID] as transDef_Type_ID, 
	TD.[Create_Packages] as transDef_Create_Packages, 
	TD.[Is_Stock_Taking_Controlled] as transDef_Is_Stock_Taking_Controlled, 
	TD.[Stock_Taking_Type] as transDef_Stock_Taking_Type,
	TD.[ID] as transDef_ID,
	TD.[Name] as transDef_Name,
	TD.[Transaction_Reason_Code] as Transaction_Reason_Code,
	
	-- Top Transaction Definition
	TopTD.Description as Top_Transaction_Definition_Description,

	-- Warehouses columns
	W.[Code] as Warehouse_Code,
	W.[Description] as Warehouse_Description, 
	W.[Handling_Unit] as Warehouse_Handling_Unit,
	W.[Is_Stocktaking] as Warehouse_Is_Stocktaking,

	-- Positions columns
	Pos.[Computed_Code] as Position_Computed_Code, 
	Pos.[Code] as Position_ID_Code,
	Pos.[Decode_Code] as Position_Decode_Code,
	Pos.[Row] as Position_Row, 
	Pos.[XColumn] as Position_Column,
	Pos.[Floor] as Position_Floor,

	-- Transaction_Types columns
	TT.[Code] as transDef_Type_Code, 
	TT.[Description] as transDef_Type_Description,

	-- Products columns
	P.[Code] as Product_Code,
	P.[Key_1] as Product_Key_1,
	P.[Key_2] as Product_Key_2,
	P.[Key_3] as Product_Key_3,
	P.[Key_4] as Product_Key_4,
	P.[Key_5] as Product_Key_5,
	P.[Reference_N2] as Product_Reference_N2,
	P.[Stock_MU_ID] as Product_Stock_MU_ID,
	P.[Stock_MU_Code] as Product_Stock_MU_Code,
	P.[Group_Name] as Product_Group,
	P.[Description] as Product_Description,
	P.[Description_2] as Product_Description_2,
	P.[Primary_Owner_ID] as product_primary_owner_id,
	P.[XType] as Product_Type,

	-- Users columns (joined on 'Parent_User_ID')
	PU.[Name] as [User_Name],
	PU.[Description] as User_Description,

	-- Users columns (joined on 'Updated_By_User')
	UU.[Name] as Updated_By_Name,
	UU.[Description] as Updated_By_Description,

	-- Warehouse_Packages columns (for first and last generated labels of a transaction, for target package)
	FGL.Label_Number AS First_Generated_Label_Number, 
	LGL.Label_Number AS Last_Generated_Label_Number,
	TP.[Label_Number] AS Target_Package_Label_Number,

	-- Generic_Orders columns
	GenO.[Order_Number] as Order_Number,
	GenO.[Order_Type_ID_Code] as Order_Type,

	stockTaking.[Stock_Taking_Type],
	TDSave.[Reporting]
from dciowner.Transactions ST
	inner join dciowner.Transaction_Definitions TD 
  		on ST.Transaction_Definition_ID = TD.ID
	left outer join dciowner.Transaction_Definitions_Save_Id_Reporting_View TDSave /*View jsem pridal rucne, vse ok*/
		on TD.ID = TDSave.Trans_Def_ID and ST.Save_ID = TDSave.Save_ID /*tohle taky neumi*/
	left outer join dciowner.Transaction_Types TT
		on TD.Transaction_Type_ID = TT.ID
	left outer join dciowner.Locations L
		on TD.Comp_Location_ID = L.ID
	left outer join dciowner.Users PU
		on ST.Parent_User_ID = PU.ID
	left outer join dciowner.Users UU
		on ST.Updated_By_ID = UU.ID
	left outer join dciowner.Positions Pos
		on ST.From_Position_ID= Pos.ID
	left outer join dciowner.Warehouses W
		on ST.From_Warehouse_ID = W.ID
	left outer join dciowner.Products_View P
		on ST.Product_ID = P.ID
	left outer join dciowner.Stock_Takings stockTaking
		on ST.Stock_Taking_ID = stockTaking.ID
	left outer join dciowner.Warehouse_Packages FGL 
  		on ST.First_Generated_Label_ID = FGL.ID
	left outer join dciowner.Warehouse_Packages LGL 
  		on ST.Last_Generated_Label_ID = LGL.ID
	left outer join dciowner.Warehouse_Packages TP
		on ST.Target_Package_ID = TP.ID
	left outer join dciowner.Generic_Orders GenO
		on ST.Order_ID = GenO.ID
	left outer join dciowner.Transaction_Definitions as TopTD
		on TopTD.ID = ST.Transaction_Definition_ID