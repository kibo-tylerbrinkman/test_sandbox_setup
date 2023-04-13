const apiContext = require("../resources/apiContext")
const inventoryResource = require("mozu-node-sdk/clients/commerce/inventory")(apiContext);

const createInventoryRecord = async (skus) => {

	try {

		const inventory_payload = skus.map(sku => {
			return {
				quantity: 100,
				upc: sku
			}
		})
		const body = {
			items: inventory_payload,
			locationCode: 'homebase'
		}

		//console.log(body)
		await inventoryResource.refreshInventory({}, { body });
		console.log(`Added Inventory for Products to homebase`)

	} catch (error) {
		console.log(error)	
	}

}

module.exports = createInventoryRecord;