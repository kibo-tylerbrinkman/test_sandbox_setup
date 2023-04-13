const apiContext = require("../resources/apiContext")
const Client = require('mozu-node-sdk/client');
const constants = Client.constants;

const productTypeFactory =  Client.sub({
	addProductType: Client.method({
		method: constants.verbs.POST,
		url: '{+tenantPod}api/commerce/catalog/admin/attributedefinition/producttypes'
	}), 
	updateProductType: Client.method({
		method: constants.verbs.PUT,
		url: '{+tenantPod}api/commerce/catalog/admin/attributedefinition/producttypes/{productTypeId}'
	})
});

const productTypeResource = productTypeFactory(apiContext);

const createProductType = async (body) => {
	try {

		if (body.id === 1){
			await productTypeResource.updateProductType({ productTypeId: 1}, { body });
			console.log(`Product type ${body.name} was updated`)
		} else {
			await productTypeResource.addProductType({}, { body });
			console.log(`Product type ${body.name} was created with id: ${body.id}`)
		}

	} catch (error) {
		console.log(error);	
	}
}

module.exports = createProductType;