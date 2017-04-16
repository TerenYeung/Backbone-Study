$(function(){

    var Todo = Backbone.Model.extend({

        defaults: function(){

            return {
                title: 'todo',
                done: false,
                order: 0,
            }
        },

    });

    var TodoList = Backbone.Collection.extend({

        // url: '/',

        model: Todo,

        localStorage: new Backbone.LocalStorage('todos-backbone'),
    });

    var todoList = new TodoList;

    var TodoView = Backbone.View.extend({

        tagName: 'li',

        className: 'todo-item',

        template: _.template($('#item-template').html()),

        initialize: function(){

            this.listenTo(this.model, 'change', this.render)
        },

        render: function(){

            this.$el.html(this.template(this.model.toJSON()));
            this.$el.toggleClass('done',this.model.get('done'));

            return this;

        },

    })

    var AppView = Backbone.View.extend({

        //AppView视图类的挂载节点
        el: $('#app'),

        //定义AppView视图类的各种事件及其回调函数
        events: {
            'keypress #new-todo'        : 'createOnEnter',
            'click #toggle-all'      : 'toggleAllComplete',
            'click #clear-completed' : 'clearCompleted',
        },

        initialize: function(){
            // console.log(this.$)
            this.$newTodo = this.$('#new-todo');
            this.allCheckbox = this.$('#toggle-all')[0];

            this.listenTo(todoList, 'add', this.addOne);


        },

        createOnEnter: function(e){

            if(e.keyCode != 13) return;

            if(!this.$newTodo.val()) return;

            var title = this.$newTodo.val();

            todoList.create({title: title});

            this.$newTodo.val('');
        },

        toggleAllComplete: function(){

            var done = this.allCheckbox.checked;
            todoList.each(function(todo){
                todo.save({'done': done});
            });

        },

        clearCompleted: function(){},

        addOne: function(todo){
            var todoView = new TodoView({model: todo});
            this.$('#todo-list').append(todoView.render().el);
        },

    });

    // 启动应用
    var App = new AppView;

})