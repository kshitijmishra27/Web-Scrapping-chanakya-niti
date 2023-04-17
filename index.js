const request = require('request');
const cheerio = require('cheerio');
const fs = require('fs');

let arr = ["one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten",
 "eleven", "twelve", "thirteen", "fourteen", "fifteen", "sixteen", "seventeen"];

let all_data = [];

try {
    // read existing data from file if it exists
    let data = fs.readFileSync('niti.json');
    all_data = JSON.parse(data);
} catch (err) {
    // file does not exist or is empty, continue with empty array
}

// feature -> request
for(let i = 0; i < arr.length; i++){
    let url = `https://chanakyadrishti.com/chapter-${arr[i]}-english/`;
    request(url, cb);
}

function cb(error, response, html) {
    if (error) {
        console.error('error:', error); // Print the error if one occurred
    } else {
        handlehtml(html);
    }
}

function handlehtml(html) {
    let selTool = cheerio.load(html);
    let contentArr = selTool("blockquote");

    for (let j = 0; j < contentArr.length; j++) {
        let data = selTool(contentArr[j]).text();

        if (!isNaN(data[0])) { // check if the first character is a number
            data = data.substring(data.indexOf(" ") + 1).trim(); // ignore the number and extract only the quote text
        }

        const new_data = {
            quote : data
        }

        all_data.push(new_data);
    }

    // write data to file after handling HTML
    fs.writeFileSync('niti.json', JSON.stringify(all_data));
}
