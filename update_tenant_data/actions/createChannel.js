const apiContext = require("../resources/apiContext")
const channelResource = require("mozu-node-sdk/clients/commerce/channel")(apiContext);

const createChannel = async (tenantId, siteId, channelBody) => {

	try {
		let body = JSON.parse(channelBody);

		body.tenantId = tenantId;
		body.siteIds = [siteId];

		await channelResource.createChannel({}, { body });
		console.log(`Channel: ${body.name} was created with channel code: ${body.code}`)

	} catch (error) {
		console.log(error)	
	}

}

module.exports = createChannel;