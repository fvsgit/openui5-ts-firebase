import BaseController from "./BaseController";
import JSONModel from "sap/ui/model/json/JSONModel";
// import UI5Date from "sap/ui/core/date/UI5Date";
import formatter from "../model/formatter"; 

/**
 * @namespace firebaseui5.controller
 */
export default class Settings extends BaseController {

	formatter: any = formatter

	public onInit(): void {
		var oViewModel = new JSONModel({
			currentUser: "Administrator",
			lastLogin: undefined /*UI5Date.getInstance(Date.now() - 86400000)*/
		});

		this.setModel(oViewModel, "view");
	}

	
} 