$(function(){

    var Todo = Backbone.Model.extend({

        defaults: function(){
            return {
                title: 'todoMVC',
                done: false,
                order: 0,
            }
        },
    });

    var Todos = Backbone.Collection.extend({

        model: Todo,

        localStorage: new Backbone.LocalStorage('todoMVC'),

    });

    var todos = new Todos;

    var TodoView = Backbone.View.extend({

        tagName: 'li',

        className: 'todo-item',

        template: _.template($('#item-template').html()),

        initialize: function(){

            this.listenTo(this.model, 'change', this.render);
        },

        render: function(){

            this.$el.html(this.template(this.model.toJSON()));
            this.$el.toggleClass('done', this.model.get('done'));
            return this;

        },

    })

    var AppView = Backbone.View.extend({

        el: $('#app'),

        events: {
            'keypress #new-todo'    : 'createOnEnter',
            'click #toggle-all'     : 'toggleAllCompleted',
        },

        initialize: function(){

            this.$newTodo = this.$('#new-todo');
            this.allCheckbox = this.$('#toggle-all')[0];

            this.listenTo(todos, 'add', this.addOne);
        },

        createOnEnter: function(e){

            var title = this.$newTodo.val();

            if(e.keyCode != 13) return;
            if(!title) return;

            todos.create({title: title});

            this.$newTodo.val('');
        },

        addOne: function(model){

            //todo is a model when todos.create() dispatch added

            var todoView = new TodoView({model: model});

            this.$('#todo-list').append(todoView.render().el);

        },

        toggleAllCompleted: function(){

            var done = this.allCheckbox.checked;

            todos.each(function(todo){
                todo.save({'done': done});
            })
        },

    });

    var App = new AppView;

})