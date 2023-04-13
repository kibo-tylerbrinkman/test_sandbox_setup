const {getTenantName, generateImportZip} = require('./import_setup/index')
const importJob = require('./import_product_data/import')
const loadSiteData = require('./update_tenant_data/loadSiteData')
const indexCatalog = require('./update_tenant_data/indexCatalog')

async function main(){
	const name = await getTenantName()

	console.log(`Loading catalog data into ${name}`)

	//await generateImportZip(name)


	console.log('Import files generated.....')

	//await importJob()
	console.log('Product data loaded....')

	//await loadSiteData()

	console.log('Site data loaded....')
	console.log('Indexing catalog....')
	//await indexCatalog(name)

	console.log('Catalog Indexed....')

	//images......
}

main()