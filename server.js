var express = require('express');
var exphbs = require('express-handlebars');
const docusign = require('docusign-esign');
const path = require('path');
const apiClient = new docusign.ApiClient();
var app = express();
const fs = require('fs');

// set view engine
//app.engine('handlebars', exphbs({defaultLayout: 'index'}));
app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');
app.use(express.static(path.join(__dirname, 'public')));

//API Routes

//On execution an envelope is sent to the provided email address, one signHere
//tab is added, the document supplied in workingdirectory\fileName is used.
//Open a new browser pointed at http://localhost:3000 to execute. 
//-------------------------------------------------------------------------------
//-------------------------------------------------------------------------------

//Fill in your token / ID / recipient / Filename Here

//Obtain an OAuth token from https://developers.docusign.com/oauth-token-generator
//Obtain your accountId from account-d.docusign.com > Go To Admin > API and Keys

const OAuthToken = 'eyJ0eXAiOiJNVCIsImFsZyI6IlJTMjU2Iiwia2lkIjoiNjgxODVmZjEtNGU1MS00Y2U5LWFmMWMtNjg5ODEyMjAzMzE3In0.AQkAAAABAAUABwCADhwwxDHWSAgAgE4_Pgcy1kgCAEE9O2tWpqBBnPQFvSlBC6MVAAEAAAAYAAEAAAAFAAAADQAkAAAAZjBmMjdmMGUtODU3ZC00YTcxLWE0ZGEtMzJjZWNhZTNhOTc4EgABAAAACwAAAGludGVyYWN0aXZlMAAAS1IuxDHWSA.5biRXZfy8zuuu63QxzyxjNLBT3TJpynMn2hhVUO_phMqADsYAJYICHAdyTPCcost82IGHbiCBMVAP_oEAAmtTsXGTkYTIkbSXYMtaCvjTpLJOTMn1BWdPwQJwvyzG7yh6aXTVF94N3eOAEkJkwW8DvLR5hI12wKx2YR5kVajV2FD2SSkWcftx0BcSUQmQ_ttKn6r8ZO6eiIJpjQwngQMF0jN4Xc9ZifUZ3Lj7PNARTM8T61FjUjtoHMfaijGfWlW5ZYsFI_fn-szZ7moS0pXBXGPxi_827COp42Jk4RrJDDw3hfnJTYw3-p5-80VyR-ips6xIW9w88MWuSVgFJTzjA';
const accountId = '85b4ce3d-cccd-4711-baaa-ece2df5c24ee';


//Recipient Information goes here
const recipientName = 'Test Recipient';
const recipientEmail = 'spotapp123@gmail.com';

//Point this to the document you wish to send's location on the local machine. Default location is __workingDir\fileName
const fileName = './testDoc.pdf';

//-------------------------------------------------------------------------------
//-------------------------------------------------------------------------------

app.get('/', function(req, res) {
	res.render('index', {

	});
});

app.post('/lol', function (req, res) {

    apiClient.setBasePath('https://demo.docusign.net/restapi');
    apiClient.addDefaultHeader('Authorization', 'Bearer ' + OAuthToken);
  
    // *** Begin envelope creation ***
    
  
    //Read the file you wish to send from the local machine.
    fileStream = process.argv[2];
    pdfBytes = fs.readFileSync(path.resolve(__dirname, fileName));
    pdfBase64 = pdfBytes.toString('base64');
  
    docusign.Configuration.default.setDefaultApiClient(apiClient);
  
    var envDef = new docusign.EnvelopeDefinition();
  
    //Set the Email Subject line and email message
    envDef.emailSubject = 'Please sign this document sent from Node SDK';
    envDef.emailBlurb = 'Please sign this document sent from the DocuSign Node.JS SDK.'
  
    //Read the file from the document and convert it to a Base64String
    var doc = new docusign.Document();
    doc.documentBase64 = pdfBase64;
    doc.fileExtension = 'pdf';
    doc.name = 'Node Doc Send Sample';
    doc.documentId = '1';
  
    //Push the doc to the documents array.
    var docs = [];
    docs.push(doc);
    envDef.documents = docs;
  
    //Create the signer with the previously provided name / email address
    var signer = new docusign.Signer();
    signer.name = recipientName;
    signer.email = recipientEmail;
    signer.routingOrder = '1';
    signer.recipientId = '1';
  
    //Create a tabs object and a signHere tab to be placed on the envelope
    var tabs = new docusign.Tabs();
  
    var signHere = new docusign.SignHere();
    signHere.documentId = '1';
    signHere.pageNumber = '1';
    signHere.recipientId = '1';
    signHere.tabLabel = 'SignHereTab';
    signHere.xPosition = '50';
    signHere.yPosition = '50';
  
    //Create the array for SignHere tabs, then add it to the general tab array
    signHereTabArray = [];
    signHereTabArray.push(signHere);
  
    tabs.signHereTabs = signHereTabArray;
  
    //Then set the recipient, named signer, tabs to the previously created tab array
    signer.tabs = tabs;
  
    //Add the signer to the signers array
    var signers = [];
    signers.push(signer);
  
    //Envelope status for drafts is created, set to sent if wanting to send the envelope right away
    envDef.status = 'sent';
  
    //Create the general recipients object, then set the signers to the signer array just created
    var recipients = new docusign.Recipients();
    recipients.signers = signers;
  
    //Then add the recipients object to the enevelope definitions
    envDef.recipients = recipients;
  
    // *** End envelope creation ***
    
    
    //Send the envelope
    var envelopesApi = new docusign.EnvelopesApi();
    envelopesApi.createEnvelope(accountId, { 'envelopeDefinition': envDef }, function (err, envelopeSummary, response) {
  
      if (err) {
        return res.send('Error while sending a DocuSign envelope:' + err);
      }
  
      res.send(envelopeSummary);
  
    });
  });




app.post('/docusignAPI', function (req, res) {

  apiClient.setBasePath('https://demo.docusign.net/restapi');
  apiClient.addDefaultHeader('Authorization', 'Bearer ' + OAuthToken);

  // *** Begin envelope creation ***

  
  //Read the file you wish to send from the local machine.
  fileStream = process.argv[2];
  pdfBytes = fs.readFileSync(path.resolve(__dirname, fileName));
  pdfBase64 = pdfBytes.toString('base64');

  docusign.Configuration.default.setDefaultApiClient(apiClient);

  let envDef = new docusign.EnvelopeDefinition();

  //Set the Email Subject line and email message
  envDef.emailSubject = 'Please sign this document sent from Node SDK';
  envDef.emailBlurb = 'Please sign this document sent from the DocuSign Node.JS SDK.'

  //Read the file from the document and convert it to a Base64String
  let doc = new docusign.Document();
  doc.documentBase64 = pdfBase64;
  doc.fileExtension = 'pdf';
  doc.name = 'Node Doc Send Sample';
  doc.documentId = '1';

  //Push the doc to the documents array.
  let docs = [];
  docs.push(doc);
  envDef.documents = docs;

  //Create the signer with the previously provided name / email address
  let signer = new docusign.Signer();
  signer.name = recipientName;
  signer.email = recipientEmail;
  signer.routingOrder = '1';
  signer.recipientId = '1';
  signer.clientUserId = '123'; //ClientUserId specifies that a recipient is captive. It ties to a generic DocuSign account and cannot be referenced without generating a recipient token.

  //Create a tabs object and a signHere tab to be placed on the envelope
  let tabs = new docusign.Tabs();

  let signHere = new docusign.SignHere();
  signHere.documentId = '1';
  signHere.pageNumber = '1';
  signHere.recipientId = '1';
  signHere.tabLabel = 'SignHereTab';
  signHere.xPosition = '50';
  signHere.yPosition = '50';

  //Create the array for SignHere tabs, then add it to the general tab array
  signHereTabArray = [];
  signHereTabArray.push(signHere);

  tabs.signHereTabs = signHereTabArray;

  //Then set the recipient, named signer, tabs to the previously created tab array
  signer.tabs = tabs;

  //Add the signer to the signers array
  let signers = [];
  signers.push(signer);

  //Envelope status for drafts is created, set to sent if wanting to send the envelope right away
  envDef.status = 'sent';

  //Create the general recipients object, then set the signers to the signer array just created
  let recipients = new docusign.Recipients();
  recipients.signers = signers;

  //Then add the recipients object to the enevelope definitions
  envDef.recipients = recipients;
  
  // *** End envelope creation *** 
  

  //Send the envelope
  let envelopesApi = new docusign.EnvelopesApi();
  envelopesApi.createEnvelope(accountId, { 'envelopeDefinition': envDef }, function (err, envelopeSummary, response) {

    if (err) {
      return res.send('Error while creating a DocuSign envelope:' + err);
    }
    //Set envelopeId the envelopeId that was just created
    let envelopeId = envelopeSummary.envelopeId;

    //Fill out the recipient View request. authenticationMethod should be email. ClientUserId, RecipientId, returnUrl, userName (Full name of the signer), and email are required.
    //If a clientUserId was not specified, leave it out.
    let recipientViewRequest = new docusign.RecipientViewRequest();
    recipientViewRequest.authenticationMethod = 'email';
    recipientViewRequest.clientUserId = '123';
    recipientViewRequest.recipientId = '1';
    recipientViewRequest.returnUrl = 'http://localhost:3000/dsreturn';
    recipientViewRequest.userName = recipientName;
    recipientViewRequest.email = recipientEmail;

    //Create the variable used to handle the response
    recipientViewresults = docusign.ViewLinkRequest();

    //Make the request for a recipient view
    envelopesApi.createRecipientView(accountId, envelopeId, { recipientViewRequest: recipientViewRequest }, function (err, recipientViewResults, response) {

      if (err) {
        return res.send('Error while creating a DocuSign recipient view:' + err);
      }

      //Set the signingUrl variable to the link returned from the CreateRecipientView request
      let signingUrl = recipientViewResults.url;

      //Then redirect to the signing URL
      res.redirect(signingUrl);
    });

  });

});

app.get('/dsreturn', function (req, res) {
  //Enter code here for post-processing after enevelope signing has been completed.
  res.send('Welcome back, enter followup code / processing information here.');
});

var server = app.listen(process.env.PORT || 8080, function() {
    var port = server.address().port;
console.log('port is', port);
});

