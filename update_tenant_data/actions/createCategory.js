
const apiContext = require("../resources/apiContext")
const Client = require('mozu-node-sdk/client');
const constants = Client.constants;

const categoryFactory =  Client.sub({
	addCategory: Client.method({
		method: constants.verbs.POST,
		url: '{+tenantPod}api/commerce/catalog/admin/categories'
	}),
	getCategories: Client.method({
		method: constants.verbs.GET,
		url: '{+tenantPod}api/commerce/catalog/admin/categories/?startIndex={startIndex}&pageSize={pageSize}&sortBy={sortBy}&filter={filter}&responseFields={responseFields}'
	}),
});

const categoryResource = categoryFactory(apiContext);

const getCategories = async () => {
	try {
		let systGeneratedCategoryIds = {}
		const categories = await categoryResource.getCategories({pageSize: 200});	
		for (let i of categories.items){
			systGeneratedCategoryIds[i.content.name] = i.id;
		}	
		return systGeneratedCategoryIds;
	} catch (error) {
		console.log(error)	
	}
}


const createCategory = async (topLevelCategories, childLevelCategories) => {

	try {
		for (let body of topLevelCategories){
			await categoryResource.addCategory({}, { body });
			console.log(`Top level category: ${body.content.name} was created with category code: ${body.categoryCode}`);
		}

		const systGeneratedCategoryIds = await getCategories();

		for (let body of childLevelCategories){

			const parentCategoryName = body.parentCategoryName;

			if (systGeneratedCategoryIds.parentCategoryName){
				body.parentCategoryId = systGeneratedCategoryIds[parentCategoryName];
			} else {
				// HANDLE NESTED CATEGORIES
				const getNestedParentCategoryId = await getCategories();
				body.parentCategoryId =  getNestedParentCategoryId[parentCategoryName];
			}

			await categoryResource.addCategory({}, { body });
			console.log(`Nested category: ${body.content.name} was created with category code: ${body.categoryCode}`);
		}

	} catch (error) {
		console.log(error)	
	}
}

module.exports = {
	createCategory,
	getCategories
}