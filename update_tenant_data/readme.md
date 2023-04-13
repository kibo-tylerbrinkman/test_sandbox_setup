# Training Readiness Scripts

### Instructions:

1. Install this application to the desired sandbox
2. Change tenant and site in `mozu.config.json`
3. Load training catalog by running these two commands in the terminal:
```
    npm install
    node loadCatalog.js
```
4. Then you need to do some manual things on the tenant to get it fully set up.
	- Add a NoOp Payment Gateway (System → Settings → Payment Gateways)
	- Add that payment gateway for Visa (System → Settings → Payment Types)
	- Set up very basic Route Strategy in Order Routing
	- Settings → Shipping → Carriers, set up “Shipping From” and In Store Pickup
	- Go to General → Settings, Then enable “Transfer Shipments” and “Always Create Transfer Shipments”
5. A slight delay occurs before being able to submit orders. If errors occur when running ```node submitOrders.js``` just wait 5-10 minutes and re-run:
```
    node submitOrders.js
```

Sometimes when creating the products Kibo decides it doesn't want to index those products and the nav bar is blank. To fix that add all the current sandbox ids in "fixIndexing.js" and it will check that the indexing is good and fix it if necessary. Then just wait a little bit for your nav bar to reindex. The command is:

    node fixIndexing.js