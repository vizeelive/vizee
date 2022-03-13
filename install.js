#!/usr/bin/env zx

// creates singer config to import the last month of Stripe reoords in order
// to create the tables in the postgres stripe schema
var date = new Date();
date.setMonth(date.getMonth() - 1);

let singerStripeConfig = {
  "client_secret": "sk_test_51GxNPWFN46jAxE7QAgehRwQRt8kAwpoAPgbG42RWFmFn7VtE4a2TvgQqhDuxI5TR4yeSOFU4nbt6GzsmqmHss9DL00IUKUl7da",
  "account_id": "acct_1GxNPWFN46jAxE7Q",
  "start_date": date
};

$`echo {}>singer/config/state.json`;
$`echo ${JSON.stringify(singerStripeConfig)} > singer/config/stripe-config.json`;