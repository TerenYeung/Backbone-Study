$(function(){

    //Backbone -> MVC框架

    //如何将一个todosMVC使用MVC框架搭建出来？

    //Model类：定义每一个todoItem的状态，相当于数据表中的一条记录
        /*todoItem类定义如下：

            let Todo = Backbone.Model.extend({});

            为app的todoItem定义一个类

            Todo类包含的状态有：

                Backbone.Model.extend({

                    idAttribute: '_id', //定义每一个事项唯一标识

                    defaults: {
                        title: '',  //待办事项
                        done: false, //完成情况
                        order: 0, //事项出现的先后顺序
                    },

                    initialize: function(){
                        id: _.uniqueId('todo_'), //为每个todo创建唯一id,

                    }

                })


        */

	/*
	 *
	 *
	 *
	 */

    let Todo = Backbone.Model.extend({

        idAttribute: '_id',

        default: function(){

            return {
                title: '',
                done: false,
                order: 0,
            }
        },

        initialzie: function(){

            let todoId = _.uniqueId('todo_');
            this.set('_id',todoId);
        }
    });

    //Collection类: 定义模型的有序集合，相当于数据库中的表
        /*
        * 由所有todo项目组成的集合只有两种状态：
        * 完成和未完成
        * done和undone
        * */

    let Todos = Backbone.Collection.extend({

        model: Todo, //定义集合中包含的模型类

        done: function(){

            let doneArr = _.filter(function(todo){
                return todo.get('done');
            })

            return doneArr;
        },

        undone: function(){
            let undoneArr = _.without.apply(this,this.done());

            return undoneArr;
        }
    })

    //TodoView类: 定义每个todo项目的视图
        /*
        *
        *
        * */
})