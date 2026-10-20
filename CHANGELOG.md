## 2.0.0

Works with BTCPay Server 2.x and Zapier Platform 19.

### Breaking changes
- Removed the custodian account actions and search (BTCPay Server 2.0 removed custodian accounts): "Get the Deposit Address for a Custodian Account", "Get Asset Balance in Custodian Account", "Convert an Asset", "Withdraw From a Custodian Account to Store Wallet" and "Get Custodian Account Details".
- On-chain wallet actions use the BTCPay Server 2.x wallet paths and need BTCPay Server 2.0 or newer.
- "Create User" no longer asks for a password. BTCPay Server invites the user to set one, and the output has the "Invitation URL".
- "Create Payment Request" no longer has the "Embedded CSS" and "Custom CSS URL" fields, which BTCPay Server 2.0 removed.
- "Open Store Lightning Channel" takes the channel amount in satoshi.

### Fixes
- Turning off a Zap now deletes its webhook in BTCPay Server, also when the webhook was already deleted.
- "Find Invoice by Order ID" only returns an invoice with that order ID.
- "Create Payment Request" can set the expiry date.
- "Open Store Lightning Channel" connects to the peer first.
- "Mark Invoice Settled" and "Mark Invoice Invalid" return the invoice with its new status.
- "Pay a Lightning Invoice" returns the payment, also when it is still pending.
- Errors show the message from BTCPay Server.

### New
- "Payment Received" and "Invoice Payment Settled" give the payment: method, amount, fee, status, destination and time.
- Invoices have the fields "Paid Amount", "Invoice Type", "Order URL" and "Buyer Phone".
- "Create User" has the optional fields "Name" and "Send Invitation Email".
