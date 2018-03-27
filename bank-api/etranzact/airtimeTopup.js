var request = require('request');
var convert = require('xml-js');

var reference = (Math.random()+' ').substring(2,10)+(Math.random()+' ').substring(2,10)
var terminalid = "7017010004"
var pin = "lHm5HGfHwfeawMayR6DIoQ=="
var destination = "08083718137"
var provider = "AIRTEL"
var lineType = "VTU"
var senderName = "Akinlabi Ajelabi"
var address = "Victoria Island, Lagos" //google maps
var amount = "100"
console.log(reference)

let xml =
`<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:ws="http://ws.fundgate.etranzact.com/">
   <soapenv:Header/>
   <soapenv:Body>
      <ws:process>
         <request>
            <!--Optional:-->
            <direction>request</direction>
            <action>VT</action>
            <!--Optional:-->
            <terminalId>7017010004</terminalId>
            <transaction>
               <pin>` + pin + `</pin>
               <provider>` + provider + `</provider>
               <lineType>` + lineType + `</lineType>
               <amount>` + amount + `</amount>
               <destination>` + destination + `</destination>
               <senderName>` + senderName + `</senderName>
               <address>` + address + `</address>
               <reference>` + reference +`</reference>
               <endPoint>A</endPoint>
            </transaction>
         </request>
      </ws:process>
   </soapenv:Body>
</soapenv:Envelope>`

var options = {
  url: 'https://www.etranzact.net/FGate/ws?wsdl',
  method: 'POST',
  body: xml,
  headers: {
    'Content-Type':'text/xml;charset=utf-8',
    'Accept-Encoding': 'gzip,deflate',
    'Content-Length':xml.length,
    'SOAPAction':""
  }
};

let callback = (error, response, body) => {
  if (!error && response.statusCode == 200) {
    console.log('Raw result', body);
    // parser.parseString(body, (err, result) => {
    //   console.log('JSON result', result);
    // });
    console.log(JSON.parse(convert.xml2json(body, {compact: true, spaces: 4}))['S:Envelope']['S:Body']['ns2:processResponse']['response']['message']['_text']);
  };
  console.log('E', response.statusCode, response.statusMessage);
};
request(options, callback);
