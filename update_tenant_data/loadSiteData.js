const sqlite3 = require('sqlite3').verbose();
// sqlite brought in because squlite3 doesn't support async/await
const { open } = require('sqlite');

const createChannel = require('./actions/createChannel');
const createLocationType = require('./actions/createLocationType');
const createLocation = require('./actions/createLocation');
const createLocationGroup = require('./actions/createLocationGroup');
const createInventoryRecord = require('./actions/createInventoryRecord');
const createCustomerAccount = require('./actions/createCustomerAccount');

const fs = require('fs');
const readConfig = fs.readFileSync('mozu.config.json');
const { tenant: tenantId, site: siteId } = JSON.parse(readConfig);

async function loadSiteData (){

	try {
		const db = await open({
			filename: './mystic_catalog.sqlite3',
			driver: sqlite3.Database
		})

		let channels = [];
		let locationTypes = [];
		let locations = [];
		let inventory_skus = [];
		let locationGroups = [];
		let customers = [];

		await db.each('SELECT * FROM channels', (err, row) => {
			if (err) throw err;
			channels.push(row.data);
		});

		for (let channel of channels){
			await createChannel(tenantId, siteId, channel);
		}

		await db.each('SELECT * FROM location_types', (err, row) => {
			if (err) throw err;
			locationTypes.push(row.data);
		});

		for (let locationType of locationTypes){
			await createLocationType(locationType);
		}
		
		await db.each('SELECT * FROM locations', (err, row) => {
			if (err) throw err;
			locations.push(row.data);
		});

		for (let location of locations){
			await createLocation(location);
		}

		await db.each('SELECT * FROM location_groups', (err, row) => {
			if (err) throw err;
			locationGroups.push(row.data);
		});

		for (let locationGroup of locationGroups){
			await createLocationGroup(locationGroup, siteId);
		}

		await db.each('SELECT * FROM customers', (err, row) => {
			if (err) throw err;
			customers.push(row.data);
		});

		for (let customer of customers){
			await createCustomerAccount(customer);
		}
	

		await db.each('SELECT * FROM inventory_skus', (err, row) => {
			if (err) throw err;
			inventory_skus.push(row.sku);
		});

	
		await createInventoryRecord(inventory_skus);

		console.log('--------------------------------------------------------------------------')
		console.log(`SUCCESS! Follow instructions in readme before running node submitOrders.js`);
	} catch (error) {
		console.log(error);	
	}

}

module.exports = loadSiteData
