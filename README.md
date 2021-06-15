# BTCPay Server Integration for Zapier.com

This repository contains the Zapier integration for BTCPay Server.
It allows you to integrate and automate BTCPay Server.

## Requirements
- An account at Zapier.com
- A BTCPay Server instance where you have 1 or more stores
- An API Key that has access to the store and resources you want to automate

## Features
The Zapier integration allows you to use triggers from BTCPay Server (like when a new invoice was created, paid or expired) to trigger actions in other systems, like send an email, post a chat message, etc.

## Current state
This integration uses the new Greenfield API and webhooks for real-time communications.
All triggers and actions in this repo should be functional.
More triggers and actions will be added over time.

Working Triggers:
- Invoice Created

Working Actions:
- Create a New Invoice
