import formatMessage from "sap/base/strings/formatMessage";

export default {

	formatMessage: formatMessage,

	/**
		 * Determines the path of the image depending if its a phone or not the smaller or larger image version is loaded
		 *
		 * @public
		 * @param {boolean} bIsPhone the value to be checked
		 * @param {string} sImagePath The path of the image
		 * @returns {string} path to image
		 */
	srcImageValue: (bIsPhone: boolean, sImagePath: string) => {
		if (bIsPhone) {
			sImagePath += "_small";
		}
		return sImagePath + ".jpg";
	}

}