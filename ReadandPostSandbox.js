//this displays the request on the browser

const someHost = "https://en1f7xwpuhhka.x.pipedream.net/";
const url = someHost + "/requests/json";
const init = {
  body: JSON.stringify(body),
  method: "POST",
  headers: {
    "content-type": "application/json;charset=UTF-8",
    testing: "this is the post"
  }
};
let body = {
  results: ["default data to send"],
  errors: null,
  msg: "I sent this to the fetch"
};

async function handlePostRequest(request) {
  let reqBody = await readRequestBody(request);
  //this waits for the readRequest function below: Step 2 then goes Step 3
  const response = await fetch(url, init);
  return new Response(reqBody, init); //this displays it in the body
}

//this just shows that this is a GET request and not a POST
async function handleRequest(request) {
  let retBody = `the get works`;
  return new Response(retBody); //creates a new response object  with retBody as the content
}

addEventListener("fetch", event => {
  //this fetches the event which is the request: Step 1
  const { request } = event;
  const { url } = request;
  if (url.includes("form")) {
    //this looks in the url to find form
    return event.respondWith(rawHtmlResponse(someForm)); //this returns the rawHtml function
  }
  if (request.method === "POST") {
    return event.respondWith(handlePostRequest(request)); //goes to Step 2
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
    // const body = await request.json(); //gets a json
    const sendThis = {
      body: await request.json(),
      method: "POST",
      headers: {
        "content-type": "application/json;charset=UTF-8"
      }
    };
  } else if (contentType.includes("application/text")) {
    const body = await request.text();
    return body;
  } else if (contentType.includes("text/html")) {
    const body = await request.text();
    return body;
  } else if (contentType.includes("form")) {
    const formData = await request.formData(); //I feel like this is the important
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

// //just a form to inserted into the body
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
</html>`;
