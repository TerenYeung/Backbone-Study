$(function(){

// Todo Model

	//扩展Model类为Todo类，该Todo类用于定义
	//每个Todo实例的数据和处理数据的方法
	let Todo = Backbone.Model.extend({

		//一个Todo的默认属性
		defaults: function(){
			return {
				title: "no todo", //从输入框输入的todo项目
				done: false,
				order: null
			};
		}

		//当Todo实例创建后，初始化操作
		initialize: function(){

			//确保每一个todo实例有title
			if(!this.get('title')){
				this.set('title',this.defaults.title);
			}
		}

		//用于操作Todo实例的done属性
		toggle: function(){
			this.save('done',!this.get('done'));
		}

	})

// Todo Item View

	//创建每一个todo项目的DOM节点

	let TodoView = Backbone.View.extend({

		//指定TodoView类进行挂载的DOM节点
		tagName: 'li',

		//指定TodoView类进行渲染后的HTML
		template: _.template($('#item-template').html()),

		//定义Todo项目的事件逻辑
		events: {
			'click .toggle': 'toggleDone',
			'dblclick .view': 'edit',
			'click a.destroy': 'clear',
			'keypress .edit': 'updateOnEnter',
			'blur .edit': 'update',
		},

		//在初始化Todo Item时监听Model的变化
		//在model改变时，重绘视图；
		//在model销毁时候，移出视图；
		initialize: function(){
			this.listenTo(this.model, 'change', this.render);
			this.listenTo(this.model, 'destroy', this.reomove);
		},

		//定义各种事件的具体处理逻辑
		toggleDone: function(){

			//直接调用在Backbone.Model中的自定义类Todo的toggle方法
			this.model.toggle();
		},

		edit: function(){

			//在li元素上添加一个editing类，用于元素切换
			this.$el.addClass('editing');
			this.$input.focus();
		},

		clear: function(){
			this.model.destroy();
		},

		updateOnEnter: function(e){
			//按下回车后，保存更改
			if(e.keycode == 13) this.update();
		},

		update: function(){

			let value = this.$input.val();
			if(!value){
				this.clear();
			}else {
				this.model.save('title',value);
				this.$el.removeClass('editing');
			}
		}

	})


// Todo Collection

	//每个Collection类用于存储应用的model
	//以及对model进行处理的业务逻辑
	let TodoList = Backbone.Collection.extend({

		//指定集合的model类
		model: Todo,

		//将所有的todo项目存储在“todos-backbone”的localStorage
		localStorage: new localStorage('todos-backbone');



	});

	let Todos = new TodoList;

// Todo View

	let Appview = Backbone.View.extend({

		el: $('#todo-app'),

		statsTemplate: _.template($('#stats-template').html()),

		events: {

			'keypress #new-todo': 'createOnEnter',
			'click #toggle-all': 'toggleAllComplete',
			'click #clear-completed': 'clearComplted'

		}

		initialize: function(){

			this.input = this.$('#new-todo');
			this.allCheckbox = this.$('#toggle-all')[0];
			this.main = $('#main');
			this.footer = this.$('footer');

			this.listenTo(Todos, 'add', this.addOne());
			this.listenTo(Todos, 'reset', this.addOne());
			this.listenTo(Todos, 'all', this.addOne());

		}
	})

	let App = new AppView;

})