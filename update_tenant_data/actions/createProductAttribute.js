const apiContext = require("../resources/apiContext")
const Client = require('mozu-node-sdk/client');
const constants = Client.constants;

const attributeFactory =  Client.sub({
	getAttributes: Client.method({
		method: constants.verbs.GET,
		url: '{+tenantPod}api/commerce/catalog/admin/attributedefinition/attributes'
	}),
	addAttribute: Client.method({
		method: constants.verbs.POST,
		url: '{+tenantPod}api/commerce/catalog/admin/attributedefinition/attributes'
	})
});

const attributeResource = attributeFactory(apiContext);

const createProductAttribute = async (stringifiedBody) => {
	try {
		const body = JSON.parse(stringifiedBody);

		// first check to see if the attribute exists and if not add it
		const existingAttributes = await attributeResource.getAttributes({pageSize: 200});	
		const existingAttributesAdminNames = existingAttributes.items.map(attribute => attribute.adminName);

		if (!existingAttributesAdminNames.includes(body.adminName)){
			await attributeResource.addAttribute({}, { body });	
			console.log(`Attribute ${body.adminName} was created with attributeCode: ${body.attributeCode}`);
		}

	} catch (error) {
		console.log(error)	
	}
}

module.exports = createProductAttribute;