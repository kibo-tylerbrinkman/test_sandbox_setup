const sqlite3 = require('sqlite3').verbose();
const apiContext = require("../resources/apiContext")
const Client = require('mozu-node-sdk/client');
const constants = Client.constants;

const locationGroupFactory =  Client.sub({
	addLocationGroup: Client.method({
		method: constants.verbs.POST,
		url: '{+tenantPod}api/commerce/admin/locationGroups'
	})
});

const locationGroupResource = locationGroupFactory(apiContext);

const createLocationGroup = async (stringifiedBody, siteId) => {

	try {
		const body = JSON.parse(stringifiedBody);

		body.siteIds = [siteId];

		await locationGroupResource.addLocationGroup({}, { body });
		console.log(`Location group: ${body.name} was created with code: ${body.locationGroupCode}`)

	} catch (error) {
		console.log(error)	
	}

}

module.exports = createLocationGroup;