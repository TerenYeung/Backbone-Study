$(function(){

    let Todo = Backbone.Model.extend({

        defaults: {
            title: 'Hello World',
            done: false,
            order: 0,
        },

        initialize: function(){

            // this.
        }

    })

    let Todos = Backbone.Collection.extend({

        model: Todo,

    });

    let TodoView = Backbone.View.extend({

        tagName: 'li',

        className: 'todo-item',

        initialize: function(){

        },

        template: _.template($('#item-template').html()),





    });

    let AppView = Backbone.View.extend({

        //指定AppView类挂载的DOM节点
        el: '#todo-app',

        initialize: function(){

            this.todos = new Todos;
            this.$input = this.$el.find('#new-todo');
            this.$todoList = this.$el.find('#todo-list');

            this.listenTo(this.todos,'addTodo',this.render);

        },

        events: {
            'keypress #new-todo' : 'addItem'
        },

        addItem: function(e){

            if(e.keyCode != 13) return;

            let title = this.$input.val();
            if(!title) return;

            let todo = new Todo({title: title});

            this.todos.add(todo)
                      .trigger('addTodo',todo.attributes)

        },


        render: function(todoModel){
            let todoView = new TodoView;
            let todoHTML = todoView.template(todoModel)
            this.$todoList.append(todoHTML);
        },

    });


    let app = new AppView;

    // console.log(_.template('<h1>hello<h1>')())

})