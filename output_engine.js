#!/usr/bin/env node

// External Modules
import fs from 'fs';

// Custom Modules
import { Table } from "console-table-printer";
import ProcessingEngine from "./processing_engine/processing_engine.js";
import { main, userInfo } from './input_engine.js'

const table = new Table({
  columns: [
    { name: "Total Premiums Payable", alignment: "left" },
    { name: "Annual Premium Payable", alignment: "left" },
  ],
});

main()
  .then(() => {
    // Success:
    const engine = new ProcessingEngine();
    const totalPremiumsPayable = engine.premiumCalculator();
    const annualPremiumPayable = totalPremiumsPayable / 0.2;
    

    // const fileName = userInfo.userName;
    // if (fs.mkdir('UserFiles')) {
    //   const json = JSON.stringify(userInfo);
    //   fs.writeFileSync(`UserFiles/${fileName}.json`, json);
    // } else {
    //   fs.mkdirSync('UserFiles');
    //   const json = JSON.stringify(userInfo);
    //   fs.writeFileSync(`UserFiles/${fileName}.json`, json);
    // }

    table.addRow(
      {
        "Total Premiums Payable": totalPremiumsPayable,
        "Annual Premium Payable": annualPremiumPayable
      }, { color: 'red' });

    table.printTable();
  })
  .catch(error => {
    // Error:
    console.error("Error during main function execution:", error);
  });
