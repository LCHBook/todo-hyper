# ToDo-Hyper
Experiments in hypermedia using a simple ToDo Service

## Status
 - Working Draft -- _stuff changes here often_

## General
This repo contains a simple ToDo Service that allows maniuplating ToDo items via the Web. There are also a number of client applications in the repo. This is all experimental material exploring what it takes to make supoprting multiple representation formats on the server side safe, cheap, and easy. It is also used as a testbed for creating generic hypermedia clients for the associated media types. Some of this material may end up in the @LCHBook project.

## ToDo Service
The ToDo Service emits responses from the root node (relative root `/`). The basic service is a classic CRUD-based Web API that emits `application/json` by default. The current list of formats emitted by the service are:

 - `application/json`
 - `application/vnd.hal+json`
 - `application/vnd.collection+json`
 - `application/vnd.representor+json`
 
Other formats are being added over time.

### Suporting the Representor Pattern
One of the key goals of the server-side work is to figure out how to safely, easily, quickly support more than one output format for Web APIs. To this end, I am experimenting with the [Representor Pattern](https://github.com/the-hypermedia-project/charter#representor-pattern). The implementation here consists of the following:

 - `transitions.js` : An abstract representation of _all possible actions_ for this service
 - `connectors/home.js` : The resource module that handles HTTP requests for ToDo items
 - `representor.js` : A router that matches a requested media type w/ the proper representor module
 - `representors/*.js` : A set of representor modules that _understand_ the abstract resource model and convert that into a valid media type response. There is one module for each media type supported by the service.

There are some _fatal dependencies_ hidden in this implementation (the output of `transition.js`, the representation of resource _data_, and there may still be a bit too much tight coupling between the representor modules and the application domain (ToDo).

This is still all very experimental and subject to change. I'll continue to tweak this over time.

### Supporting ALPS Documents
One possible goal for this project is to sort out how effective [ALPS](http://alps.io/spec/index.html) documents will be as a base for the representor pattern. For example, can the `transition.js` document be _replaced_ by a valid ALPS document? What preprocessing would be needed? What implementation details (cardinalities, input ranges, etc.) that are missing from ALPS need to be supplied here and how would be that done? There are lots of other Qs for some later work.

## Hypermedia Clients
Another major goal of this experiment is to work out just what it takes to build _generic_ hypermedia clients for each of the selected hypermedia types. It is assumed that some will need more app-domain details supplied by local code than others. How much of that can be supplied and runtime to a media-type-specific engine (e.g. a hal-client, cj-client, etc.) and how much has to be built in (_a priori_) before releasing the client for installation? 

As more formats are experiemented with and more clients built, it is hoped that a clearer picture of what it takes to build generic clients for selected media type and why some media type designs are (due to their design features) easier and/or harder to work with from a _generic_ client perspective.

I'll add notes here as I build more clients.

### Using SPA as the Baseline
Right now, all the client applications use an HTML-based Single-Page App (SPA) approach. While this is not ideal (there are built-in limitations when using the Browser as your platform) this should provide an even baseline with which to compare the relative ease/difficulty of implementing generic hypermedia clients.

## Forks and PRs
Feel free to fork this repo for your own experiments and/or submit PRs for help me improve it. Since I am working on this in a rather haphazard way, I may not always be able to merge in your PRs. If that gets annoying, you'd likely be better off just forking the thing and heading off in your own direction w/o waiting for me to sort things out. 

Once this stablizes, I will be better prepared to accept contributions.

TIA - @mamund

