---
icon: lucide/blocks
title: Swiyu installs
---

#  Software & Workarounds

This section describes the local software requirements I had to comply with in order to work myself across the cookbooks. Furthermore - in order to set-up the test use cases with a demo logic in mind, different workarounds were required. Both are documented here.

## Java & didtoolbox.jar

This one is straightforward yet associated with very sensitive information. This step is therefore quite critical : we'll need to generate the pki pair for the Business Partner Identity. This requires a java runtime environment and the use of a toolbox developed by the swiyu team.

https://github.com/swiyu-admin-ch/didtoolbox-java

``` py title="DID java toolbox"

# Install a java run environment (with Homebrew)
brew install openjdk@21

# Check installation+version
java -version

# Install the DID toolbox developed by SWIYU team
wget https://github.com/swiyu-admin-ch/didtoolbox-java/releases/download/vX.Y.Z/didtoolbox.jar

# Generate your keys as per cookbook
java -jar didtoolbox.jar generate

```


## Docker

You'll need to download [Docker Desktop](https://www.docker.com) and install it. As soon as you have it locally, it is recognised in your terminal window.

The SWIYU team are indeed providing trust infrastructure services made available via GitHub. You can download those (links are provided in the cookbooks and you may follow their [GitHub account and different repositories](https://github.com/swiyu-admin-ch).)

!!! note "You cannot adapt/recompile swiyu code"

    The code is transparently shared. Everyone can look into the structure, the components. But you're not meant to modify it and if you do, you can't recompile it. If you're not in the private/secure swiyu development area (with access to specific proxy and servers) - it will not work. I wanted to adapt the CORS/proxy behaviour of the API responses and could not (which is good in fact).

Docker is dead-easy. Works out of the box and provides simple orchestration for multi-container applications using two key commands.

``` zsh title="Docker command line instructions"
# Build images, creates networks/volumes.
# Start all containers defined in your `docker-compose.yml`
# Connect as "launch everything" command.
docker compose up

# Stops all running containers triggered by "up".
# Remove containers, networks, and volumes created.
# It's your "clean shutdown and teardown" command.
docker compose down

```

Think of it as **one-command deployment** and **one-command cleanup** for complex applications that need databases, web servers, caches, and other services running simultaneously. Perfect for low-code!

!!! note "adapting your docker-compose.yml file"

    You'll need to adapt the configuration file - but a workable template is part of the swiyu distribution. Just follow the cookbook directions 👍.

## Workarounds

As I am not really a software developer but more a computer engineer that enjoys good knowledge sharing/documentation and low-code/agile learning in practice - I like to keep things simple and free (=opensource).

### Static websites

Now one thing you rapidly learn is that Zenscical/GitHub/Gitlab/Material for MKDOCS are all designed to work with ^^static^^ project sites. Of course, any code can be worked on in GitHub. But if you want to render a project page - it will be a static page. Fine for me - this is simple and to be honest, it allows you already to do a lot (html, css, javascript, plugins). But it does drive some limitations as well. 

And I am not yet ready to pay for a fully-fledged hosting server where I would be maintaining front-end and back-end etc. Luckily there are workarounds.

### Tunneling with ngrok

For instance, when I have docker service running on my local Mac Mini and it needs to be reachable from the internet, a great free tool is [ngrok](https://ngrok.com). You simply have to download it, register your account (best is to connect it to your github account). The free plan is perfectly fine if you want to test a/o demo and as long as you don't need to scale and prepare for a larger deployment.

```zsh title="install ngrok"
# check their site for details - but it is as simple as :
brew install ngrok

# once you've an account/connected ngrok with github for instance
ngrok config add-authtoken <<<your_token_goes_here>>>

# start the service : public url pointing to your localhos
ngrok https 8080

```

### Why Proxying?

Because I only want to work with static sites, my front-end is necessarily browser-based and executes JavaScript code directly from the static pages. So while I can make the swiyu cookbook work with curl instructions in my shell terminal, this doesn't work from a browser website. 

This architecture is constrained by browser security rules, specifically the Same-Origin Policy and CORS (Cross-Origin Resource Sharing) . The Same-Origin Policy prevents JavaScript running on  https://mysite.com  from making direct API calls to  https://swiyu-api.example.com  because they have different origins (protocol, domain, or port must all match) . Without proper CORS headers from the API server explicitly allowing cross-origin requests, browsers block these calls with errors like “No ‘Access-Control-Allow-Origin’ header is present” . 


``` mermaid
flowchart LR
    browser("Browser")
    static_site["Static Website"]
    api["swiyu_api.ch"]
    check{Same Origin?}
    blocked[Blocked Traffic]

    browser <--> static_site
    browser <--> api
    api --> check
    check -- NO --> blocked
```


Since the SWIYU issuer service doesn’t include the necessary CORS headers for external static sites, I implemented a proxy solution. My browser’s JavaScript sends requests to a hosted/basic proxy endpoint, which forwards them server-side to the SWIYU API . The proxy then adds the missing CORS headers ( Access-Control-Allow-Origin ) to the API response before returning it to my browser . This works because CORS restrictions only apply to browsers—the proxy-to-API communication happens server-side, outside the browser’s security sandbox .

``` mermaid
flowchart LR
    browser("Browser") <--> static_site["Static Website"]
    api["swiyu_api.ch"] --> check{"CROSS-ORIGIN OK?"} & n1["Proxy"]
    check -- YES --> flowing["Allowed Traffic"]
    browser L_browser_n1_0@--> n1
    n1 --> api & browser

    n1@{ shape: tri}

    L_browser_n1_0@{ curve: natural } 

```

### Proxy set-up with Vercel

Now running a simple proxy is probably not rocket-science, but not my usual activity. A quick research led to [Vercel.com](https://vercel.com/s). I was able to connect Vercel to my GitHub account.

All I needed to do then is to create a new repository on GitHub. I created the necessary files on my desktop and then pushed them to GitHub. Vercel synchronised automatically seeing the new commit and "push". It (re)deployed instanteneously and hence is hosting the active proxy service.

!!! note "proxy operations"

    To work around CORS restrictions in the SWIYU API, I deployed a lightweight Vercel serverless proxy that acts as a CORS-enabled intermediary.  
    
    The proxy performs two critical functions :
	       
	       1.	CORS preflight handling: Responds to browser  
	       OPTIONS  requests with proper CORS headers 
	       ( Access-Control-Allow-Origin: <authorised list> ), 
	       telling the browser that valid cross-origin requests are permitted. 
	       
	       2.	Request relay: Forwards  POST  requests 
	       server-side to my ngrok-exposed endpoint, 
	       bypassing browser CORS restrictions since 
	       server-to-server calls aren’t subject 
	       to same-origin policy.
	       
    The response from SWIYU flows back through the same chain, with the proxy injecting  Access-Control-Allow-Origin headers before returning data to the browser. This allows my static frontend to read the API response without CORS errors.
    
Key implementation detail: The  Access-Control-Allow-Origin should be restricted to specific domains for security. Think of access list of authoritative origin domains/sites and I should also add additional authentication layer on top.
    
``` mermaid
flowchart LR
    A[Browser] -->|POST request| B[Vercel Proxy]
    B -->|Relay via ngrok| C[Mac mini<br/>SWIYU API]
    C -->|Response| B
    B -->|Response + CORS headers| A
    
    style B fill:#27AE60,stroke:#1E8449,stroke-width:2px,color:#fff


```

