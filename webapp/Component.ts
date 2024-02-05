import UIComponent from "sap/ui/core/UIComponent";
import Device from "sap/ui/Device";
import models from "./model/models";

/**
 * @namespace firebaseui5
 */
export default class Component extends UIComponent {
	public static metadata = {
		manifest: "json",
	};

	private contentDensityClass: string;

	public init(): void {
		// call the base component's init function
		super.init();

		this.setModel(models.createDeviceModel(), "device");

		// create the views based on the url/hash
		this.getRouter().initialize();
	}

	/**
	 * This method can be called to determine whether the sapUiSizeCompact or sapUiSizeCozy
	 * design mode class should be set, which influences the size appearance of some controls.
	 *
	 * @public
	 * @return {string} css class, either 'sapUiSizeCompact' or 'sapUiSizeCozy' - or an empty string if no css class should be set
	 */
	public getContentDensityClass(): string {
		if (!this.contentDensityClass) {
			if (!Device.support.touch){
				this.contentDensityClass = "sapUiSizeCompact";
			} else {
				this.contentDensityClass = "sapUiSizeCozy";
			}
		} 
		return this.contentDensityClass;
	}
}
