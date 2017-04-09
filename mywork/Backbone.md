### 理解Backbone

![MVC模型](http://backbonejs.org/docs/images/intro-model-view.svg)

### Backbone的MVC工作原理

使用用Backbone，有以下好处：

- Models表示数据
数据可以被创建、销毁和存储到服务器端；

- Views表示视图
视图显示model的状态，当model变化view可以及时反映和重绘到视图；

- Controllers表示业务逻辑
UI操作导致model改变，model触发“change”事件；

### MVC扮演的角色

#### Model
- Orchestrates data and business logic.
- Loads and saves from the server.
- Emits events when data changes.

A Model manages an internal table of data attributes, and triggers "change" events when any of its data is modified. Models handle syncing data with a persistence layer — usually a REST API with a backing database. Design your models as the atomic reusable objects containing all of the helpful functions for manipulating their particular bit of data. Models should be able to be passed around throughout your app, and used anywhere that bit of data is needed.


#### View
- Listens for changes and renders UI.
- Handles user input and interactivity.
- Sends captured input to the model.

A View is an atomic chunk of user interface. It often renders the data from a specific model, or number of models — but views can also be data-less chunks of UI that stand alone. Models should be generally unaware of views. Instead, views listen to the model "change" events, and react or re-render themselves appropriately.

[persistence layer]
persistence layer is a group of files which is used to communicate between the application and DB. 2. business logic layer is the rules of how to retrieve the data information from the database, and then the sever takes those information to display on the user presentation layer.

![MVC工作原理](http://backbonejs.org/docs/images/intro-collections.svg)

#### Collection

#### API的聚合

Collection代表一类model的集合，例如:
RESTful API就是一类model的集合

```
const Books = Backbone.Collection.extend({
	url: '/books'
})
```

When fetching raw JSON data from an API, a Collection will automatically populate itself with data formatted as an array, while a Model will automatically populate itself with data formatted as an object:

[{"id": 1}] ..... populates a Collection with one model.
{"id": 1} ....... populates a Model with one attribute.

![View Rendering](http://backbonejs.org/docs/images/intro-views.svg)

![](http://backbonejs.org/docs/images/intro-routing.svg)

- Router更新URL，当你进入一个新地址

- Router追踪URL的变化

#### Backbone.Events

Backbone.Events是具有on和trigger方法的事件模块，通常用于将普通对象扩展为事件对象；

使用范围：
models用于分发事件；
views用于监听事件；

```
const event = {};

_.extend(event,Backbone.Events);

//views
event.on('alert',(data)=>{
	console.log(data)
})

//models
event.trigger('alter',"Hello World!")
```

**on**

on的事件参数灵活度高：

If you have a large number of different events on a page, the convention is to use colons to namespace them: "poll:start", or "change:selection". The event string may also be a space-delimited list of several events...

> book.on("change:title change:author", ...);

Callbacks bound to the special "all" event will be triggered when any event occurs, and are passed the name of the event as the first argument. For example, to proxy all events from one object to another:

> proxy.on("all", function(eventName) {
  object.trigger(eventName);
});

All Backbone event methods also support an event map syntax, as an alternative to positional arguments:

> book.on({
  "change:author": authorPane.update,
  "change:title change:subtitle": titleView.update,
  "destroy": bookView.remove
});

listenToobject.listenTo(other, event, callback)
Tell an object to listen to a particular event on an other object. The advantage of using this form, instead of other.on(event, callback, object), is that listenTo allows the object to keep track of the events, and they can be removed all at once later on. The callback will always be called with object as context.

view.listenTo(model, 'change', view.render);
stopListeningobject.stopListening([other], [event], [callback])
Tell an object to stop listening to events. Either call stopListening with no arguments to have the object remove all of its registered callbacks ... or be more precise by telling it to remove just the events it's listening to on a specific object, or a specific event, or just a specific callback.

**on and listenTo**

view on event -> model modify
		 <-	 event fire  <-

view listenTo model -> model modify

Here's the complete list of built-in Backbone events, with arguments. You're also free to trigger your own events on Models, Collections and Views as you see fit. The Backbone object itself mixes in Events, and can be used to emit any global events that your application needs.

Generally speaking, when calling a function that emits an event (model.set, collection.add, and so on...), if you'd like to prevent the event from being triggered, you may pass {silent: true} as an option. Note that this is rarely, perhaps even never, a good idea. Passing through a specific flag in the options for your event callback to look at, and choose to ignore, will usually work out better.

#### Backbone.Model

Backbone.Model的地位
the heart of any JavaScript application

- Orchestrates data and business logic.
- Loads and saves from the server.
- Emits events when data changes.


containing the interactive data as well as a large part of the logic surrounding it: conversions, validations, computed properties, and access control. You extend Backbone.Model with your domain-specific methods, and Model provides a basic set of functionality for managing changes.



#### Event Lists
"add" (model, collection, options) — when a model is added to a collection.
"remove" (model, collection, options) — when a model is removed from a collection.
"update" (collection, options) — single event triggered after any number of models have been added or removed from a collection.
"reset" (collection, options) — when the collection's entire contents have been reset.
"sort" (collection, options) — when the collection has been re-sorted.
"change" (model, options) — when a model's attributes have changed.
"change:[attribute]" (model, value, options) — when a specific attribute has been updated.
"destroy" (model, collection, options) — when a model is destroyed.
"request" (model_or_collection, xhr, options) — when a model or collection has started a request to the server.
"sync" (model_or_collection, response, options) — when a model or collection has been successfully synced with the server.
"error" (model_or_collection, response, options) — when a model's or collection's request to the server has failed.
"invalid" (model, error, options) — when a model's validation fails on the client.
"route:[name]" (params) — Fired by the router when a specific route is matched.
"route" (route, params) — Fired by the router when any route has been matched.
"route" (router, route, params) — Fired by history when any route has been matched.
"all" — this special event fires for any triggered event, passing the event name as the first argument followed by all trigger arguments.

```
const Sidebar = Backbone.Model.extend({
	promptColor: function(){
		let cssColor = prompt('Please enter a CSS color: ');
		this.set({'color': cssColor});
	}
})

window.sidebar = new Sidebar;

sidebar.set({'color': '#000'});

sidebar.promptColor();

```


**extend**

extendBackbone.Model.extend(properties, [classProperties])
To create a Model class of your own, you extend Backbone.Model and provide instance properties, as well as optional classProperties to be attached directly to the constructor function.

**constructor/initialize**
constructor / initializenew Model([attributes], [options])
When creating an instance of a model, you can pass in the initial values of the attributes, which will be set on the model. If you define an initialize function, it will be invoked when the model is created.

**get model.get(attribute)**
Get the current value of an attribute from the model. For example: note.get("title")

**set model.set(attributes, [options])**
Set a hash of attributes (one or many) on the model. If any of the attributes change the model's state, a "change" event will be triggered on the model. Change events for specific attributes are also triggered, and you can bind to those as well, for example: change:title, and change:content. You may also pass individual keys and values.

note.set({title: "March 20", content: "In his eyes she eclipses..."});

book.set("title", "A Scandal in Bohemia");

escapemodel.escape(attribute)
Similar to get, but returns the HTML-escaped version of a model's attribute. If you're interpolating data from the model into HTML, using escape to retrieve attributes will prevent XSS attacks.

var hacker = new Backbone.Model({
  name: "<script>alert('xss')</script>"
});

alert(hacker.escape('name'));

Backbone.sync 与 model.save()/model.fetch()/model.destory()

#### Backbone.Router

