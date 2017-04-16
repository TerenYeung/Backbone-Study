$(function(){

    var Todo = Backbone.Model.extend({

        defaults : function(){

            return {
                title: 'Hello World',
                order: 0,
                done: false,
            }
        }
    });

    var TodoList = Backbone.Collection.extend({

        model: Todo,

        done: function(){

            return this.filter(function(todo){
                return todo.get('done');
            });
        },

        remaining: function(){
            return this.without.apply(this, this.done());
        },


    });

    var todoList = new TodoList;

    var TodoView = Backbone.View.extend({

        tagName: 'li',

        className: 'todo-item',

        template: _.template($('#item-template').html()),

        events: {

            'click a.destroy' : 'clear',
        },

        initialize: function(){
            this.listenTo(this.model, 'destroy', this.remove);
        },

        render: function(){

            this.$el.html(this.template(this.model.toJSON()));

            return this;

        },

        clear: function(){
            this.model.destroy();
        }

    })

    var AppView = Backbone.View.extend({

        el: $('#todo-app'),

        statsTemplate: _.template($('#stats-template').html()),

        events: {
            'keypress #new-todo': 'createOnEnter',
        },

        initialize: function(){

            this.$input = this.$('#new-todo');
            this.$main = this.$('#main');
            this.$footer = this.$('footer');

            //监听集合的add事件，并调用addOne回调进行视图重绘
            this.listenTo(todoList, 'add', this.addOne);
            this.listenTo(todoList, 'all', this.render);


        },

        createOnEnter: function(e){

            if(e.keyCode != 13) return;

            if(!this.$input.val()) return;

            //使用集合的create方法可以直接创建一个model实例，
            //并会立即出发add事件
            todoList.create({title: this.$input.val()});

            this.$input.val('');

        },

        addOne: function(todo){
            var todoView = new TodoView({model: todo});
            this.$('#todo-list').append(todoView.render().el);

        },

        render: function(){
           var done = todoList.done().length;
           var remaining = todoList.remaining().length;

           if(todoList.length) {
               this.$main.show();
               this.$footer.show();
               this.$footer.html(this.statsTemplate(
                    {
                        done: done,remaining: remaining
                    }
               ));
           }else {
               this.$main.hide();
               this.$footer.hide();
           }

        }

    })

    var App = new AppView;
})