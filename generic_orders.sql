select 
	top 1000000
	O.Order_Number, od.Name, od.Description,

		P.Code AS Product_Code, P.Description AS Product_Description, P.Description_2 AS Product_Description_2,  
		P.Netto AS Product_Netto, P.Volume AS Product_Volume,

		
		uu.Name as User_Updated_Name,
		ps.Cli_Sup_Code as Supplier_Code, comp_sup.Name as Supplier_Name,
		ps.Sup_Cli_Code as Client_Code, comp_cli.Name as Client_Name,
		oo.Order_Number as Original_Order_Number, oo.Order_Definition_Name as Original_Order_Definition_Name,
		to_loc.Loc_Code as To_Location_Code, to_loc.Adr_Line_1 as To_Location_Adr_Line_1, 
		to_loc.Adr_Line_2 as To_Location_Adr_Line_2, to_loc.Adr_Line_3 as To_Location_Adr_Line_3, 
		to_loc.City as To_Location_City, to_loc.Zip_Code as To_Location_Zip_Code, to_loc.State_ID_Code as To_Location_State_ID_Code,
		from_loc.Loc_Code as From_Location_Code
	
	from dciowner.Generic_Orders O
	inner join dciowner.Order_Definitions od	on O.Order_Definition_Name = od.Name
	LEFT JOIN dciowner.Products P				ON O.Product_ID = P.ID

		left join dciowner.Users uu					on uu.ID = O.Updated_By_ID
		left join dciowner.Users uc					on uc.ID = O.User_ID
		left join dciowner.Partnerships ps			on ps.ID = O.Partnership_ID
		left join dciowner.Generic_Orders oo		on oo.ID = O.Original_Order_ID /*sam sebe taky neumim dodelat*/
		left join dciowner.Locations to_loc			on to_loc.ID = O.To_Location_ID /*tohle neumim, pravdepodobne predelat builder i frontend*/
		left join dciowner.Locations from_loc		on from_loc.ID = O.From_Location_ID
		left join dciowner.Order_Detail_Numbers_View odn on odn.ID = O.ID /*asi navic*/
		left join dciowner.Companies comp_sup on comp_sup.ID = ps.Sup_ID
		left join dciowner.Companies comp_cli on comp_cli.ID = ps.Cli_ID
