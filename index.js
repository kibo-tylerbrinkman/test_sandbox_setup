
const fs = require('fs')

async function main(){
	const config = {
		"appKey": process.env.appKey,
		"sharedSecret": process.env.sharedSecret,
		"tenant": process.env.tenant,
		"site": process.env.site,
		"baseUrl": "https://home.mozu.com"
	} 

	fs.writeFileSync('mozu.config.json', JSON.stringify(config), 'utf-8', err => console.log(err))

	const {getTenantName, generateImportZip} = require('./import_setup/index')
	const importJob = require('./import_product_data/import')
	const loadSiteData = require('./update_tenant_data/loadSiteData')
	const indexCatalog = require('./update_tenant_data/indexCatalog')
	
	const name = await getTenantName()

	console.log(`Loading catalog data into ${name}`)

	await generateImportZip(name)


	console.log('Import files generated.....')

	await importJob()
	console.log('Product data loaded....')

	await loadSiteData()

	console.log('Site data loaded....')
	console.log('Indexing catalog....')
	await indexCatalog(name)

	console.log('Catalog Indexed....')

	//images......
}

main()