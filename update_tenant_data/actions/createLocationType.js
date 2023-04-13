const apiContext = require("../resources/apiContext")
const locationTypeResource = require("mozu-node-sdk/clients/commerce/admin/locationType")(apiContext);

const createLocationType = async (stringifiedBody) => {

	try {
		const body = JSON.parse(stringifiedBody);

		await locationTypeResource.addLocationType({}, { body });
		console.log(`Location type: ${body.name} was created with code: ${body.code}`)

	} catch (error) {
		console.log(error)	
	}

}

module.exports = createLocationType;