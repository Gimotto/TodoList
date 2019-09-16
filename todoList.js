$(document).ready(function(){
    updateTodoList();
    
    $('form').on('submit', function(e){
        e.preventDefault();
        var inputs = {
            title: $('input[name=title]').val(), 
            category: $('select[name=category]').val(),
            priority: $('input[name=priority]:checked').val(),
            description: $('textarea[name=description').val(),
            done: false
        };

        if(!inputs.title){
            $('input[name=title]')
            .css('border', 'solid 1px red')
            .attr('placeholder', 'Campo obbligatiorio')
        } else {
            $.ajax({
                dataType:'json',
                type: 'POST',
                url: 'http://localhost:3000/todos',
                data: inputs,
                dataType: 'html',
                success: function(){
                    updateTodoList();
                }
            })
        }
    });
    
    $('#deleteEdit').on('click', function(){
    //Annulla la modifica di un elemento
        $('input[name=title]').val(null);
        $('select[name=category]').val(null);
        $('input[name=priority][value="media"]').prop('checked', true);
        $('textarea[name=description').val(null);
        $('#deleteEdit').css('display', 'none');
        $('input[type=submit]').css('display', 'block');
        $('#deleteEdit').css('display', 'none');
        $('#confirmEdit').css('display', 'none');
        return;
    });
    $('#confirmEdit').on('click', function(){
    //Conferma la modifica di un elemento
        var inputs = {
            title: $('input[name=title]').val(), 
            category: $('select[name=category]').val(),
            priority: $('input[name=priority]:checked').val(),
            description: $('textarea[name=description').val(),
            done: false
        };
        $.ajax({
            dataType: 'json',
            type: 'PUT',
            url: 'http://localhost:3000/todos/'+$(this).attr('class'),
            data: inputs,
            success: function(){
                updateTodoList();
            }
        });
    });
})
function deleteTodo(id){
//elimina un elemento dalla lista
    $.ajax({
        dataType: 'json',
        type: 'DELETE',
        url: 'http://localhost:3000/todos/'+id,
        success: function(){
            updateTodoList();
        }
    });
}
function editTodo(id){
//modifica un elemento dalla lista
    $.ajax({
        dataType: 'json',
        type: 'GET',
        url: 'http://localhost:3000/todos/'+id,
        success: function(a){
            $('input[name=title]').val(a.title);
            $('select[name=category]').val(a.category);
            $('input[name=priority][value="'+a.priority+'"]').prop('checked', true);
            $('textarea[name=description').val(a.description);
            $('input[type=submit]').css('display', 'none');
            $('#deleteEdit').css('display', 'block');
            $('#confirmEdit').css('display', 'block').attr('class', id);
        }
    })
}
function updateTodoList(){
    //Aggiorna le liste
        $.ajax({
            dataType: 'json',
            type: 'GET',
            url: 'http://localhost:3000/todos',
            success: function(a){
                $.each(a, function(i){
                    if(a[i].done==true||a[i].done=='true'){
                        $('#contenitoreDone ul').append('<li id="'+i+'"></li><button onclick="deleteTodo('+a[i].id+')">Delete</button><button onclick="check('+a[i].id+', '+a[i].done+')">StillTodo</button>');
                        $.each(a[i], function(name, value){
                            if(name!='done' && name!='id' && value){
                                $('#contenitoreDone ul li#'+i).append('<strong>'+name+'</strong>'+': '+value+', ');
                            }
                        });
                    } else {
                        $('#contenitoreTodo ul').append('<li id="'+i+'"></li><button onclick="editTodo('+a[i].id+')">Edit</button><button onclick="deleteTodo('+a[i].id+')">Delete</button><button onclick="check('+a[i].id+')">Done</button>');
                        $.each(a[i], function(name, value){
                            if(name!='id'&& name!='done' && value){
                                $('#contenitoreTodo ul li#'+i).append('<strong>'+name+'</strong>'+': '+ value + ', ');     
                            }
                        });
                    }
                });
            }
        });
    }
function check(id, done){
    $.ajax({
        dataType: 'json',
        type: 'PATCH',
        url: 'http://localhost:3000/todos/'+id,
        data: {"done": !done},
        success: function(){
            updateTodoList();
        }
    })
}
