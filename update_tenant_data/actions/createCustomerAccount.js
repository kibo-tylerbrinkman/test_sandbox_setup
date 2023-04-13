const apiContext = require("../resources/apiContext")
const customerResource = require("mozu-node-sdk/clients/commerce/customer/customerAccount")(apiContext);

const createCustomerAccount = async (stringifiedBody) => {
	try {
		const body = JSON.parse(stringifiedBody);

		await customerResource.addAccount({}, { body });
		console.log(`Customer account created for ${body.userName}`);

	} catch (error) {
		console.log(error);	
	}
}

module.exports = createCustomerAccount;