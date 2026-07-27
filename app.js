//console.log("Hello from Node.js!");

const { promises } = require("superagent/lib/node/response")

// console.log("Node version:", process.version);
// console.log("Current file:", __filename);
// console.log("Current folder:", __dirname);

// const math = require("./math").default;
// console.log(math.add(5,3));

// const Fs = require('fs');
// const text = Fs.readFileSync("./file.txt" , "utf-8");
// console.log(text);
// console.log(45);

// const textOut= "This is more text, written in output file";
// Fs.writeFileSync("./Output.txt" , textOut);


// const Fs = require('fs');

// Fs.readFile("./output.txt", "utf-8", (err, data) => {
//   if (err) {
//     console.error(err);
//     return;
//   }
//   console.log(data);
// });

// console.log("Reading file");

// const { clear } = require('console');
//const FS = require('fs');

// FS.readFile('./Output.txt','utf-8', (err,data) =>{
//   console.log(data);
// });

// console.log("Reading file");





// const http     = require('http');
// const FS       = require('fs');
// const url      = require('url');
// const slugify  = require('slugify');

// console.log(slugify("Hello World!", { lower: true }));

// const server = http.createServer((req, res) => {

//     const { query, pathname } = url.parse(req.url, true);

//     if (pathname === '/' || pathname === '/overview') {
//         res.end("This is overview");

//     } else if (pathname === '/product') {
//         console.log(pathname);
//         console.log(query);
//         console.log(query.name);
//         console.log(slugify(query.name, { lower: true })); 
//         res.end("This is product");

//     } else if (pathname === '/api') {
//         FS.readFile('./data.json', 'utf-8', (err, data) => {
//             if (err) {
//                 res.statusCode = 500;
//                 return res.end("Error reading file");
//             } else {
//                 const productData = JSON.parse(data);
//                 res.setHeader("Content-Type", "application/json");
//                 res.end(JSON.stringify(productData));
//             }
//         });

//     } else {
//         res.statusCode = 404;
//         res.end("Page not found");
//     }
// });

// server.listen(8000, '127.0.0.1', () => {
//     console.log("Listening on port 8000");
// });



// //Event Emitter
// const EventEmitter = require("events");

// const myEmitter = new EventEmitter();

// myEmitter.on('newSale', () => {
//     console.log("There was a new Sale");
// });

// myEmitter.on('newSale', (stock, price) => {
//     console.log("Customer name: Jonas");
//     console.log(stock, price);
// });

// myEmitter.emit("newSale", 33,456);


// const fs = require('fs');
// const server = require('http').createServer();

// server.on('request', (req, res) => {
//     fs.readFile('Output.txt', 'utf-8', (err, data) => {
//         if (err) {
//             console.log(err);
//             res.writeHead(500);
//             return res.end('Server error reading file');
//         }
//         res.end(data);
//     });
// });
// //this load the whole data of file in memory
// //for this we use streamm

// server.listen(8000, '127.0.0.1', () => {
//     console.log("listening");
// }); 







// const fs = require('fs');

// const readableStream = fs.createReadStream('Output.txt', 'utf-8');

// readableStream.on('data', (chunk) => {
//     console.log('New chunk received:');
//     console.log(chunk);
//     // readableStream.pipe(res); //for server 
// });

// readableStream.on('end', () => {
//     console.log('Finished reading the file.');
// });

// readableStream.on('error', (err) => {
//     console.log('Error:', err);
// });



// const { Calculator, multiply } = require('./math.js');

// const c1 = new Calculator();
// console.log(c1.add(3, 4)); // 7

// console.log(multiply(2, 3)); 



// const fs = require('fs');
 const superagent = require('superagent');

// fs.readFile(`${__dirname}/dog.txt`, 'utf-8', (err, data) => {
//     if (err) {
//         console.log(err);
//         return;
//     }

//     console.log(`Breed : ${data}`);

//     superagent
//         .get(`https://dog.ceo/api/breed/${data}/images/random`)
//         .end((err,res) => {
//             console.log(res.body.message);
//         });        
// });




// note: .promises
const fs = require('fs'); 
const { resolve, reject } = require("superagent/lib/request-base");
const { readFile } = require("fs/promises");
const { log } = require("console");
const console = require("console");

// fs.readFile('dog.txt', 'utf-8')
//     .then(res => console.log(res)) // solve resove promise
//     .catch(err => console.log(err)); // solve error in promise


// building promise

const fileread = file => {
    return new Promise((resolve, reject) => {
        fs.readFile(file, 'utf-8', (err, data) => {
            if (err) {
                console.log('Error occurred:', err); 
                return reject("error bc");
            }
            resolve(data);
        });
    });
};



const writeFile = (file, data) => {
    return new Promise((resolve, reject) => {
        fs.writeFile(file, data, (err) => {
            if (err) return reject("Could not write file");
            resolve("Success");
        });
    });
};
    

// fileread(`${__dirname}/dog.txt`)
//     .then(data => {
//         console.log('SUCCESS:', data);
//         return superagent.get(`https://dog.ceo/api/breed/${data}/images/random`);
//     })
//     .then(res => {
//         console.log(res.body.message);
//         return writeFile(`dog.txt`,res.body.message);
//     })
//     .catch(err => {
//         console.log('CAUGHT ERROR:', err)
//     });


const getDocPic = async () => {
    try{ 
    const data = await fileread(`${__dirname}/dog.txt`);
    console.log('SUCCESS:', data);
    
    const res = await superagent.get(`https://dog.ceo/api/breed/${data}/images/random`);
    console.log(res.body.message);

    await writeFile(`dog.txt`,res.body.message);
    console.log("Dog image saved to file");
    // we dont have catch here so we use in whie declaring getDogPic
    }catch(err){
        console.log(err);
        throw err;
    }
    return " Ready !!!";
}


getDocPic().then( x => {
    console.log(x);
}).catch((err) => {
    console.log(err);
})
;