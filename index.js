// Followed guide at https://scotch.io/tutorials/scraping-the-web-with-node-js

var express = require('express'),
    fs = require('fs'),
    request = require('request'),
    cheerio = require('cheerio'),
    colors = require( 'colors' ),
    console = require('better-console'),
    app = express();

app.set('port', (process.env.PORT || 5000));
app.use(express.static(__dirname + '/public'));

app.get('/', function(request, response) {
  response.send('Hello World!');
});

app.get('/scrape', function(req, res) {

  process.stdout.write( '\n=====>\tScrape started!\n' );

  var i = 0,
      products = [
        {
          'name': 'Merth',
          'url' : 'http://amzn.com/B00N4ABOXU'
        },
        {
          'name': 'Villager',
          'url' : 'http://amzn.com/B00N4ABMUA'
        },
        {
          'name': 'WFT',
          'url' : 'http://amzn.com/B00N49EERY'
        }
      ];

  function lookupProduct ( product ) {
    i++;

    if ( i <= products.length ) {

      process.stdout.write( '\tLooking up '+product.name+':\r' );

      request.get( product.url, function(error, response, html) {

        // First we'll check to make sure no errors occurred when making the request
        if ( !error ) {

          process.stdout.clearLine();  // clear current text
          process.stdout.cursorTo(0);

          var $ = cheerio.load( html );

          // Attempt to grab the price of the product. Will be 0 if not found.
          var price = Number( $('#actualPriceValue').text().replace(/[^0-9\.]+/g,"") ),
              isFound = price > 0 && price < 13,
              foundText = isFound ? String('FOUND!').green.bold : '';

          process.stdout.write( '\t'+product.name+':  '+String('$'+price).blue.bold+'\t'+foundText+'\n' );

        } else {
          console.error( '\tError looking up'+product.name );
          console.error( error );
        }

        lookupProduct( products[i] );
      } );
    } else {
      process.stdout.write( '=====>\tScrape completed!\n' );
    }
  };

  lookupProduct( products[0] );
  res.send( 'Scrap started!' );
});

app.listen(app.get('port'), function() {
  console.log("Node app is running at localhost:" + app.get('port'));
});
