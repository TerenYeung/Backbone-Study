$(function(){

    var Todo = Backbone.Model.extend({

        defaults: function(){
            return {
                title: 'todoMVC',
                done: false,
                order: 0,
            }
        },

        toggle: function(){
            this.save({'done': !this.get('done')});
        },
    });

    var Todos = Backbone.Collection.extend({

        model: Todo,

        localStorage: new Backbone.LocalStorage('todoMVC'),

        done: function(){

            return this.filter(function(todo){
                return todo.get('done');
            });

        },

        remaining: function(){

            return this.without.apply(this, this.done());
        },

    });

    var todos = new Todos;

    var TodoView = Backbone.View.extend({

        tagName: 'li',

        className: 'todo-item',

        template: _.template($('#item-template').html()),

        events: {

            'click .toggle'     : 'toggleDone',
            'click a.destroy'   : 'clear',
            'dblclick .view'    : 'edit',
            'keypress .edit'    : 'updateOnEnter',
            'blur .edit'        : 'close',
        },

        initialize: function(){

            this.listenTo(this.model, 'change', this.render);
            this.listenTo(this.model, 'destroy', this.remove);
        },

        render: function(){

            this.$el.html(this.template(this.model.toJSON()));
            this.$el.toggleClass('done', this.model.get('done'));
            return this;

        },

        toggleDone: function(){

            this.model.toggle();
        },

        clear: function(){

            this.model.destroy();
        },

        edit: function(){
          this.$el.addClass('editing');
          this.$('.edit').focus();
        },

        updateOnEnter: function(e){
            if(e.keyCode == 13) this.close();
        },

        close: function(){
            var title = this.$('.edit').val();
            if(!title){
                this.clear();
            }else {
                this.model.save({title: title});
                this.$el.removeClass('editing');
            }
        },

    })

    var AppView = Backbone.View.extend({

        el: $('#app'),

        events: {
            'keypress #new-todo'    : 'createOnEnter',
            'click #toggle-all'     : 'toggleAllCompleted',
            'click #clear-completed': 'clearCompleted',
        },

        statsTemplate: _.template($('#stats-template').html()),

        initialize: function(){

            this.$newTodo = this.$('#new-todo');
            this.allCheckbox = this.$('#toggle-all')[0];
            this.$main = this.$('#main');
            this.$footer = this.$('footer');

            this.listenTo(todos, 'add', this.addOne);
            this.listenTo(todos, 'all', this.render);
            this.listenTo(todos, 'reset', this.addAll);

            todos.fetch();
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

        clearCompleted: function(){

            _.invoke(todos.done(), 'destroy');
        },

        render: function(){

            var done = todos.done().length,
                remaining = todos.remaining().length;

            if(!todos.length) {

                this.$main.hide();
                this.$footer.hide();
            }else {
                this.$main.show();
                this.$footer.show();
                this.$footer.html(this.statsTemplate({
                    done: done,
                    remaining: remaining,
                }));
            }
            this.allCheckbox.checked = !remaining;

        },

        addAll: function(){

            var _this = this
            todos.each(function(todo){
                _this.addOne(todo);
            })
        }

    });

    var App = new AppView;

})