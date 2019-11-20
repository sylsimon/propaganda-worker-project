//this displays the request on the browser
async function handlePostRequest(request) {
  let reqBody = await readRequestBody(request); //this waits for the readRequest function below
  let retBody = `The request body sent in was ${reqBody}`;
  return new Response(retBody); //this displays it in the body
}

//this just shows that this is a GET request and not a POST
async function handleRequest(request) {
  let retBody = `The request was a GET `;
  return new Response(retBody); //creates a new response object  with retBody as the content
}

addEventListener("fetch", event => {
  const { request } = event;
  const { url } = request;
  if (url.includes("form")) {
    //this looks in the url to find form
    return event.respondWith(rawHtmlResponse(someForm)); //this waits for the rawHtml function
  }
  if (request.method === "POST") {
    return event.respondWith(handlePostRequest(request));
  } else if (request.method === "GET") {
    return event.respondWith(handleRequest(request));
  }
});
/**
 * rawHtmlResponse delievers a response with HTML inputted directly
 * into the worker script
 * @param {string} html //creates a string data type where the parameter is html
 */
async function rawHtmlResponse(html) {
  const init = {
    headers: {
      "content-type": "text/html;charset=UTF-8"
    }
  }; //include init in html
  return new Response(html, init); //creates a new response object  with html and init as the content
}
/**
 * readRequestBody reads in the incoming request body
 * Use await readRequestBody(..) in an async function to get the string
 * @param {Request} request the incoming request to read from
 */
async function readRequestBody(request) {
  const { headers } = request; //store the json from the request in headers
  const contentType = headers.get("content-type"); //get the content type of the header
  //console.log(headers.get("content-type"))
  if (contentType.includes("application/json")) {
    //finds a json
    const body = await request.json(); //gets a json
    return JSON.stringify(body); //converts JSON to a string
  } else if (contentType.includes("application/text")) {
    const body = await request.text();
    return body;
  } else if (contentType.includes("text/html")) {
    const body = await request.text();
    return body;
  } else if (contentType.includes("form")) {
    const formData = await request.formData();
    let body = {}; //create empty body for the html file
    for (let entry of formData.entries()) {
      body[entry[0]] = entry[1];
    }
    return JSON.stringify(body);
  } else {
    let myBlob = await request.blob();
    var objectURL = URL.createObjectURL(myBlob);
    return objectURL;
  }
}

//just a form to inserted into the body
const someForm = `
<!DOCTYPE html>
<html>
<body>
<h1>Hello World</h1>
<p>This is all generated using a Worker</p>
<form action="/demos/requests" method="post">
  <div>
    <label for="say">What  do you want to say?</label>
    <input name="say" id="say" value="Hi">
  </div>
  <div>
    <label for="to">To who?</label>
    <input name="to" id="to" value="Mom">
  </div>
  <div>
    <button>Send my greetings</button>
  </div>
</form>
</body>
</html>
`;
