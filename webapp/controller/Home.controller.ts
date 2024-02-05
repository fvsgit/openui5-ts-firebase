import BaseController from "./BaseController";
import formatter from "../model/formatter";
import JSONModel from "sap/ui/model/json/JSONModel";
import Device from "sap/ui/Device";

/**
 * @namespace firebaseui5.controller
 */
export default class Home extends BaseController {

	formatter: any = formatter

	public onInit(): void {
		var oViewModel = new JSONModel({
			isPhone: Device.system.phone
		});
		this.setModel(oViewModel, "view");
		Device.media.attachHandler(function (oDevice) {
			this.getModel("view").setProperty("/isPhone", oDevice.name === "Phone");
		}.bind(this));

	}

}

// sap.ui.define([
// 	'./BaseController',
// 	'sap/ui/model/json/JSONModel',
// 	'sap/ui/Device',
// 	'sap/ui/demo/toolpageapp/model/formatter'
// ], function (BaseController, JSONModel, Device, formatter) {
// 	"use strict";
// 	return BaseController.extend("sap.ui.demo.toolpageapp.controller.Home", {
// 		formatter: formatter,

// 		onInit: function () {
// 			var oViewModel = new JSONModel({
// 				isPhone : Device.system.phone
// 			});
// 			this.setModel(oViewModel, "view");
// 			Device.media.attachHandler(function (oDevice) {
// 				this.getModel("view").setProperty("/isPhone", oDevice.name === "Phone");
// 			}.bind(this));
// 		}
// 	});
// });