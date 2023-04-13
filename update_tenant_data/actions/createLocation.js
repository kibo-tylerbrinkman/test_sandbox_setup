const apiContext = require("../resources/apiContext")
const locationResource = require("mozu-node-sdk/clients/commerce/admin/location")(apiContext);

const createLocation = async (stringifiedBody) => {

	try {
		const body = JSON.parse(stringifiedBody);

		await locationResource.addLocation({}, { body });
		console.log(`Location: ${body.name} was created with code: ${body.code}`)

	} catch (error) {
		console.log(error)	
	}

}

module.exports = createLocation;