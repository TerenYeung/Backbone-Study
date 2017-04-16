$(function(){

    var Todo = Backbone.Model.extend({

        defaults: function(){

            return {
                title: 'todo',
                done: false,
                order: 0,
            }
        },

        initialize: function(){
            if(!this.get('title')){
                this.set({'title': this.defaults().title});
            }
        },

        toggle: function(){
            this.save({done: !this.get('done')});
        },

    });

    var TodoList = Backbone.Collection.extend({

        // url: '/',

        model: Todo,

        localStorage: new Backbone.LocalStorage('todoMVC'),

        done: function(){
            // return _.filter(this, function(todo){
            //     return todo.get('done');
            // })

            return this.filter(function(todo){
                return todo.get('done');
            })
        },

        // remaining: function(){
        //     return this.without()
        // }
    });

    var todoList = new TodoList;

    var TodoView = Backbone.View.extend({

        tagName: 'li',

        className: 'todo-item',

        template: _.template($('#item-template').html()),

        events: {
            'click .toggle'     : 'toggleDone',
            'click a.destroy'   : 'clear',
            'dblclick .view'    : 'edit',
            'keypress .edit'    : 'updateOnEnter',
            'blur .edit'        : 'close'
        },

        initialize: function(){

            this.listenTo(this.model, 'change', this.render);
            this.listenTo(this.model, 'destroy', this.remove);
        },

        render: function(){

            this.$el.html(this.template(this.model.toJSON()));
            this.$el.toggleClass('done',this.model.get('done'));
            this.$edit = this.$('.edit');
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
            this.$edit.focus();
        },

        updateOnEnter: function(e){
            if(e.keyCode == 13) this.close();
        },

        close: function(){
            var value = this.$edit.val();
            if(!value) {
                this.clear()
            }else {
                this.model.save({title: value});
                this.$el.removeClass('editing');
            }

        }

    })

    var AppView = Backbone.View.extend({

        //AppView视图类的挂载节点
        el: $('#app'),

        //定义AppView视图类的各种事件及其回调函数
        events: {
            'keypress #new-todo'        : 'createOnEnter',
            'click #toggle-all'         : 'toggleAllComplete',
            'click #clear-completed'    : 'clearCompleted',
        },

        statsTemplate: _.template($('#stats-template').html()),

        initialize: function(){
            // console.log(this.$)
            this.$newTodo = this.$('#new-todo');
            this.allCheckbox = this.$('#toggle-all')[0];
            this.$main = this.$('#main');
            this.$footer = this.$('footer');

            this.listenTo(todoList, 'add', this.addOne);
            this.listenTo(todoList, 'all', this.renderStats);
            this.listenTo(todoList, 'reset', this.addAll);

            todoList.fetch();
            // console.log(todoList.models)
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

        clearCompleted: function(){

            _.invoke(todoList.done(),'destroy');
            return false;
        },

        addOne: function(todo){
            var todoView = new TodoView({model: todo});
            this.$('#todo-list').append(todoView.render().el);
        },

        renderStats: function(){
            var done = todoList.done().length;
            var remaining = todoList.length - done;

            if(todoList.length){
                this.$main.show();
                this.$footer.show();
                this.$footer.html(this.statsTemplate({
                    done: done,
                    remaining: remaining,
                }))
            }else {
                this.$main.hide();
                this.$footer.hide();
            }
            this.allCheckbox.checked = !remaining;
        },

        addAll: function(){
            todoList.each(this.addOne, this);
        }

    });

    // 启动应用
    var App = new AppView;

})