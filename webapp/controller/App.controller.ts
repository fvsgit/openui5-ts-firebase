import BaseController from "./BaseController";
import mobileLibrary from "sap/m/library";
import Device from "sap/ui/Device";
import MessageToast from "sap/m/MessageToast";
import ActionSheet from "sap/m/ActionSheet";
import Button from "sap/m/Button";
import syncStyleClass from "sap/ui/core/syncStyleClass";
import MessagePopover from "sap/m/MessagePopover";
import ResponsivePopover from "sap/m/ResponsivePopover";
import NotificationListItem from "sap/m/NotificationListItem";
import CustomData from "sap/ui/core/CustomData";
import Link from "sap/m/Link";
import MessageItem from "sap/m/MessageItem";
import { initializeApp, getAuth } from "firebaseui5/lib/firebase";

// shortcut for sap.m.PlacementType
var PlacementType = mobileLibrary.PlacementType;

// shortcut for sap.m.VerticalPlacementType
var VerticalPlacementType = mobileLibrary.VerticalPlacementType;

// shortcut for sap.m.ButtonType
var ButtonType = mobileLibrary.ButtonType;

/**
 * @namespace firebaseui5.controller
 */
export default class App extends BaseController {

	_bExpanded: true

	public onInit(): void {

		this.getView().addStyleClass(this.getOwnerComponent().getContentDensityClass());

		// if the app starts on desktop devices with small or medium screen size, collaps the side navigation
		if (Device.resize.width <= 1024) {
			this.onSideNavButtonPress();
		}

		Device.media.attachHandler(this._handleWindowResize, this);
		this.getRouter().attachRouteMatched(this.onRouteChange.bind(this));

		const firebaseConfig = {
			apiKey: "AIzaSyCy1d13pYC79sOgUZnn4-sJ5VM9QY6TjqM",
			authDomain: "github-followers-281ea.firebaseapp.com",
			projectId: "github-followers-281ea",
			storageBucket: "github-followers-281ea.appspot.com",
			messagingSenderId: "576057379323",
			appId: "1:576057379323:web:4fb59feea548cdefa1235e",
		};

		// Initialize Firebase
		const app = initializeApp(firebaseConfig);

		//Initialize Firebase Authentication and get a reference to the service
		const auth = getAuth(app);
		console.log(auth);
	}

	public onExit(): void {
		Device.media.detachHandler(this._handleWindowResize, this);
	}

	public onRouteChange(oEvent: any): void {
		this.getModel('side').setProperty('/selectedKey', oEvent.getParameter('name'));

		if (Device.system.phone) {
			this.onSideNavButtonPress();
		}
	}

	public onUserNamePress(oEvent): void {

		var oSource = oEvent.getSource();
		this.getModel("i18n").getResourceBundle().then(function (oBundle: any) {
			// close message popover
			var oMessagePopover = this.byId("errorMessagePopover");
			if (oMessagePopover && oMessagePopover.isOpen()) {
				oMessagePopover.destroy();
			}
			var fnHandleUserMenuItemPress = function (oEvent: any) {
				this.getBundleText("clickHandlerMessage", [oEvent.getSource().getText()]).then(function (sClickHandlerMessage: any) {
					MessageToast.show(sClickHandlerMessage);
				});
			}.bind(this);
			var oActionSheet = new ActionSheet(this.getView().createId("userMessageActionSheet"), {
				title: oBundle.getText("userHeaderTitle"),
				showCancelButton: false,
				buttons: [
					new Button({
						text: '{i18n>userAccountUserSettings}',
						type: ButtonType.Transparent,
						press: fnHandleUserMenuItemPress
					}),
					new Button({
						text: "{i18n>userAccountOnlineGuide}",
						type: ButtonType.Transparent,
						press: fnHandleUserMenuItemPress
					}),
					new Button({
						text: '{i18n>userAccountFeedback}',
						type: ButtonType.Transparent,
						press: fnHandleUserMenuItemPress
					}),
					new Button({
						text: '{i18n>userAccountHelp}',
						type: ButtonType.Transparent,
						press: fnHandleUserMenuItemPress
					}),
					new Button({
						text: '{i18n>userAccountLogout}',
						type: ButtonType.Transparent,
						press: fnHandleUserMenuItemPress
					})
				],
				afterClose: function () {
					oActionSheet.destroy();
				}
			});
			this.getView().addDependent(oActionSheet);
			// forward compact/cozy style into dialog
			syncStyleClass(this.getView().getController().getOwnerComponent().getContentDensityClass(), this.getView(), oActionSheet);
			oActionSheet.openBy(oSource);
		}.bind(this));
	}

	public onSideNavButtonPress(): void {
		var oToolPage = this.byId("app");
		var bSideExpanded = oToolPage.getSideExpanded();
		//this._setToggleButtonTooltip(bSideExpanded);
		oToolPage.setSideExpanded(!oToolPage.getSideExpanded());
	}

	private _setToggleButtonTooltip(bSideExpanded): void {
		var oToggleButton = this.byId('sideNavigationToggleButton');
		this.getBundleText(bSideExpanded ? "expandMenuButtonText" : "collpaseMenuButtonText").then(function (sTooltipText: string) {
			oToggleButton.setTooltip(sTooltipText);
		});
	}

	// Errors Pressed
	public onMessagePopoverPress(oEvent: any): void {

		var oMessagePopoverButton = oEvent.getSource();
		if (!this.byId("errorMessagePopover")) {
			this.getModel("i18n").getResourceBundle().then(function (oBundle: any) {
				var oMessagePopover = new MessagePopover(this.getView().createId("errorMessagePopover"), {
					placement: VerticalPlacementType.Bottom,
					items: {
						path: 'alerts>/alerts/errors',
						factory: this._createError.bind(this, oBundle)
					},
					afterClose: function () {
						oMessagePopover.destroy();
					}
				});
				this.byId("app").addDependent(oMessagePopover);
				// forward compact/cozy style into dialog
				syncStyleClass(this.getView().getController().getOwnerComponent().getContentDensityClass(), this.getView(), oMessagePopover);
				oMessagePopover.openBy(oMessagePopoverButton);
			}.bind(this));
		}
	}

	/**
	 * Event handler for the notification button
	 * @param {sap.ui.base.Event} oEvent the button press event
	 * @public
	 */
	public onNotificationPress(oEvent: any): void {
		var oSource = oEvent.getSource();
		this.getModel("i18n").getResourceBundle().then(function (oBundle: any) {
			// close message popover
			var oMessagePopover = this.byId("errorMessagePopover");
			if (oMessagePopover && oMessagePopover.isOpen()) {
				oMessagePopover.destroy();
			}
			var oButton = new Button({
				text: oBundle.getText("notificationButtonText"),
				press: function (oEvent) {
					MessageToast.show(oBundle.getText("clickHandlerMessage", [oEvent.getSource().getText()]));
				}
			});
			var oNotificationPopover = new ResponsivePopover(this.getView().createId("notificationMessagePopover"), {
				title: oBundle.getText("notificationTitle"),
				contentWidth: "300px",
				endButton: oButton,
				placement: PlacementType.Bottom,
				content: {
					path: 'alerts>/alerts/notifications',
					factory: this._createNotification.bind(this)
				},
				afterClose: function () {
					oNotificationPopover.destroy();
				}
			});
			this.byId("app").addDependent(oNotificationPopover);
			// forward compact/cozy style into dialog
			syncStyleClass(this.getView().getController().getOwnerComponent().getContentDensityClass(), this.getView(), oNotificationPopover);
			oNotificationPopover.openBy(oSource);
		}.bind(this));
	}

	/**
	 * Factory function for the notification items
	 * @param {string} sId The id for the item
	 * @param {sap.ui.model.Context} oBindingContext The binding context for the item
	 * @returns {sap.m.NotificationListItem} The new notification list item
	 * @private
	 */
	private _createNotification(sId: string, oBindingContext: any): NotificationListItem {
		var oBindingObject = oBindingContext.getObject();
		var oNotificationItem = new NotificationListItem({
			title: oBindingObject.title,
			description: oBindingObject.description,
			priority: oBindingObject.priority,
			close: function (oEvent) {
				var sBindingPath = oEvent.getSource().getCustomData()[0].getValue();
				var sIndex = sBindingPath.split("/").pop();
				var aItems = oEvent.getSource().getModel("alerts").getProperty("/alerts/notifications");
				aItems.splice(sIndex, 1);
				oEvent.getSource().getModel("alerts").setProperty("/alerts/notifications", aItems);
				oEvent.getSource().getModel("alerts").updateBindings("/alerts/notifications");
				this.getBundleText("notificationMessageDeleted").then(function (sMessageText: string) {
					MessageToast.show(sMessageText);
				});
			}.bind(this),
			datetime: oBindingObject.date,
			authorPicture: oBindingObject.icon,
			press: function () {
				this.getModel("i18n").getResourceBundle().then(function (oBundle: any) {
					MessageToast.show(oBundle.getText("notificationItemClickedMessage", [oBindingObject.title]));
				});
			},
			customData: [
				new CustomData({
					key: "path",
					value: oBindingContext.getPath()
				})
			]
		});
		return oNotificationItem;
	}

	private _createError(oBundle, sId, oBindingContext): MessageItem {
		var oBindingObject = oBindingContext.getObject();
		var oLink = new Link("moreDetailsLink", {
			text: oBundle.getText("moreDetailsButtonText"),
			press: function (oEvent) {
				this.getBundleText("clickHandlerMessage", [oEvent.getSource().getText()]).then(function (sClickHandlerMessage) {
					MessageToast.show(sClickHandlerMessage);
				});
			}.bind(this)
		});

		var oMessageItem = new MessageItem({
			title: oBindingObject.title,
			subtitle: oBindingObject.subTitle,
			description: oBindingObject.description,
			counter: oBindingObject.counter,
			link: oLink
		});
		return oMessageItem;
	}

	/**
	 * Returns a promise which resolves with the resource bundle value of the given key <code>sI18nKey</code>
	 *
	 * @public
	 * @param {string} sI18nKey The key
	 * @param {string[]} [aPlaceholderValues] The values which will repalce the placeholders in the i18n value
	 * @returns {Promise<string>} The promise
	 */
	public getBundleText(sI18nKey: string, aPlaceholderValues: string[]): Promise<string> {
		return this.getBundleTextByModel(sI18nKey, this.getModel("i18n"), aPlaceholderValues);
	}

	private _handleWindowResize(oDevice: any): void {
		if ((oDevice.name === "Tablet" && this._bExpanded) || oDevice.name === "Desktop") {
			this.onSideNavButtonPress();
			// set the _bExpanded to false on tablet devices
			// extending and collapsing of side navigation should be done when resizing from
			// desktop to tablet screen sizes)
			this._bExpanded = (oDevice.name === "Desktop");
		}
	}

}
