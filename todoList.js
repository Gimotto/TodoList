$(document).ready(function(){
    //Aggiorna la lista già salvata
    updateTodoList();
    
    $('form').on('submit', function(e){
        //Previene il normale comportamento della form e al click sul bottone "Add" aggiunge una nuova riga alla lista todo
        e.preventDefault();
        var inputs = {
            title: $('input[name=title]').val(), 
            category: $('select[name=category]').val(),
            priority: $('input[name=priority]:checked').val(),
            description: $('textarea[name=description').val(),
            done: false
        };

        //Validazione dei campi: titolo e categoria 
        if(!inputs.title && !inputs.category){
            $('input[name=title]')
            .css('border', 'solid 1px red')
            .attr('placeholder', 'Campo obbligatiorio')
            $('select[name=category]')
            .css('border', 'solid 1px red')
            .children('#nullOption')
            .remove()
            $('select[name=category]').prepend('<option id="nullOption" value="" selected>--Select Category--</option>')
        }else if(!inputs.category){
            $('select[name=category]')
            .css('border', 'solid 1px red')
            .children('#nullOption')
            .remove()
            $('select[name=category]').prepend('<option id="nullOption" value="" selected>--Select Category--</option>')
        } else if(!inputs.title){
            $('input[name=title]')
            .css('border', 'solid 1px red')
            .attr('placeholder', 'Campo obbligatiorio')
        } else {
            //chiamata in POST al server per aggiungere la nuova riga alla lista
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

    //Al click del bottone todos, mostra la lista todo e nasconde la lista done
    $('button#todos').on('click', function(){
        $('#contenitoreTodo').show();
        $('#contenitoreDone').hide();
        $('button#todos').css({'width': '75%', 'transition-propety': 'width', 'transition-duration': '750ms'}).attr('disabled', true)
        $('button#done').css({'width': '25%', 'transition-propety': 'width', 'transition-duration': '750ms'}).attr('disabled', false)
        $('#contenitoreTabs p').hide();
        $('select[name=selectTodo]').css('border', 'none');
        $('select[name=selectDone]').css('border', 'none');
        $('#contenitoreDone input[type=checkbox]').prop('checked', false);
        $('#selectAllTodo').show();
    })
    //Al click del bottone done, mostra la lista done e nasconde la lista todos
    $('button#done').on('click', function(){
        $('#contenitoreTodo').hide();
        $('#contenitoreDone').show();
        $('button#todos').css({'width': '25%', 'transition-propety': 'width', 'transition-duration': '750ms'}).attr('disabled', false)
        $('button#done').css({'width': '75%', 'transition-propety': 'width', 'transition-duration': '750ms'}).attr('disabled', true)
        $('#contenitoreTabs p').hide();
        $('select[name=selectTodo]').css('border', 'none');
        $('select[name=selectDone]').css('border', 'none');
        $('#contenitoreTodo input[type=checkbox]').prop('checked', false);
        $('#selectAllDone').show();
    })
    
    //Annulla la modifica di un elemento
    $('#deleteEdit').on('click', function(){
        $('input[name=title]').val(null);
        $('select[name=category]').val(null);
        $('input[name=priority][value="media"]').prop('checked', true);
        $('textarea[name=description').val(null);
        $('#deleteEdit').hide();
        $('input[type=submit]').show();
        $('#deleteEdit').hide();
        $('#confirmEdit').hide();
        return;
    });

    //Conferma la modifica di un elemento
    $('#confirmEdit').on('click', function(){
        var inputs = {
            title: $('input[name=title]').val(), 
            category: $('select[name=category]').val(),
            priority: $('input[name=priority]:checked').val(),
            description: $('textarea[name=description').val(),
            done: false
        };
        if(!inputs.title && !inputs.category){
            $('input[name=title]')
            .css('border', 'solid 1px red')
            .attr('placeholder', 'Campo obbligatiorio')
            $('select[name=category]')
            .css('border', 'solid 1px red')
            .children('#nullOption')
            .remove()
            $('select[name=category]').prepend('<option id="nullOption" value="">--Select Category--</option>')
        }else if(!inputs.category){
            $('select[name=category]')
            .css('border', 'solid 1px red')
            .children('#nullOption')
            .remove()
            $('select[name=category]').prepend('<option id="nullOption" value="">--Select Category--</option>')
        } else if(!inputs.title){
            $('input[name=title]')
            .css('border', 'solid 1px red')
            .attr('placeholder', 'Campo obbligatiorio')
        } else {
            //chiamata in PUT al server per aggiungere la modifica di un elemento
            $.ajax({
                dataType: 'json',
                type: 'PUT',
                url: 'http://localhost:3000/todos/'+$(this).attr('class'),
                data: inputs,
                success: function(){
                    updateTodoList();
                }
            });
        }
    });
})

//seleziona tutte le checkbox della corrispettiva lista
$('#selectAllTodo').on('click', function(){
    $('#contenitoreTodo input[type=checkbox]').each(function(){
        $(this).prop('checked', true)
        checkLi($(this).attr('class'), false, this)
    })
    $(this).hide();
})
$('#selectAllDone').on('click', function(){
    $('#contenitoreDone input[type=checkbox]').each(function(){
        $(this).prop('checked', true)
        checkLi($(this).attr('class'), true, this)
    })
    $(this).hide();
})

//apre la modale e cambia il bottone di conferma a seconda dell'azione da compiere
function openModal(id, task, title){
    $('#modalTitle').html('Are you sure?');
    $('div.modal-footer').html('<button type="button" class="btn btn-secondary" data-dismiss="modal">Nope, Close</button>');
    switch(task){
        case 'todo':
            $('div.modal-body').html('Confirm to delete "'+$('#contenitoreTodo input[type=checkbox]').filter(':checked').length+'" element from the list TODO?');
            $('div.modal-footer').append('<button type="button" class="btn btn-primary" onclick="confirmSelect()">Yep, Delete</button>');
            break;
        case 'done':
            $('div.modal-body').html('Confirm to delete "'+$('#contenitoreDone input[type=checkbox]').filter(':checked').length+'" element from the list DONE?');
            $('div.modal-footer').append('<button type="button" class="btn btn-primary" onclick="confirmSelect()">Yep, Delete</button>');
            break;
        default:
            $('div.modal-body').html('Confirm to delete: "'+title+'"');
            $('div.modal-footer').append('<button type="button" class="btn btn-primary" onclick="deleteTodo('+id+')">Yep, Delete</button>');        
            break;

    }
    $('#modal').modal();
}
//elimina un elemento dalla lista
function deleteTodo(id){
    //chiamata in DELETE al server per eliminare un elemento 
    $.ajax({
        dataType: 'json',
        type: 'DELETE',
        url: 'http://localhost:3000/todos/'+id,
        success: function(){
            updateTodoList();
        }
    });
}

//modifica un elemento dalla lista
function editTodo(id){
    //chiamata in GET al server per ricevere i valori da modificare
    $.ajax({
        dataType: 'json',
        type: 'GET',
        url: 'http://localhost:3000/todos/'+id,
        success: function(a){
            $('input[name=title]').val(a.title);
            $('select[name=category]').val(a.category);
            $('input[name=priority][value="'+a.priority+'"]').prop('checked', true);
            $('textarea[name=description]').val(a.description);
            $('input[type=submit]').hide();
            $('#deleteEdit').show();
            $('#confirmEdit').show().attr('class', id);
        }
    })
}

//Aggiorna le liste
function updateTodoList(){
    //chiamata in GET al server per ricevere i valori da inserire all'interno delle liste
    $.ajax({
        dataType: 'json',
        type: 'GET',
        url: 'http://localhost:3000/todos',
        success: function(a){
            $.each(a, function(i){
                //per ogni oggetto nel file json controlla se è da fare oppure già fatto e inseridcilo nella giusta lista
                if(a[i].done==true||a[i].done=='true'){
                    $('#contenitoreDone div table tbody').append('<tr id="'+i+'"><td><input type="checkbox" class="'+a[i].id+'" onchange="checkLi('+a[i].id+','+a[i].done+', this)"> &nbsp; &nbsp;<i class="material-icons" onclick="openModal('+a[i].id+', \'delete\', \''+a[i].title+'\')">delete</i>&nbsp;<i class="material-icons" onclick="check('+a[i].id+', '+a[i].done+')">check_circle</i></td></tr>')
                    $.each(a[i], function(name, value){
                        if(name!='id' && name!='done' && name!='checked'){
                            switch(value){
                                case 'alta':
                                    $('#contenitoreDone table tbody tr#'+i).append('<td><div class="circle" style="background-color: red"><div></td>');
                                    break;
                                case 'media':
                                        $('#contenitoreDone table tbody tr#'+i).append('<td><div class="circle" style="background-color: orange"><div></td>');
                                    break;
                                case 'bassa':
                                        $('#contenitoreDone table tbody tr#'+i).append('<td><div class="circle" style="background-color: yellow"><div></td>');
                                    break;
                                default:
                                    $('#contenitoreDone table tbody tr#'+i).append('<td>'+value+'</td>');
                                break;
                            }
                        }
                    });
                }else{
                    $('#contenitoreTodo div table tbody').append('<tr id="'+i+'"><td><input type="checkbox" class="'+a[i].id+'" onchange="checkLi('+a[i].id+','+a[i].done+', this)"> &nbsp; &nbsp;<i class="material-icons" onclick="editTodo('+a[i].id+')">edit</i>&nbsp;<i class="material-icons" onclick="openModal('+a[i].id+', \'delete\', \''+a[i].title+'\')">delete</i>&nbsp;<i class="material-icons" onclick="check('+a[i].id+')">check_circle_outline</i></td></tr>')
                    $.each(a[i], function(name, value){
                        if(name!='id' && name!='done' && name!='checked'){
                            switch(value){
                                case 'alta':
                                    $('#contenitoreTodo table tbody tr#'+i).append('<td><div class="circle" style="background-color: red"><div></td>');
                                    break;
                                case 'media':
                                        $('#contenitoreTodo table tbody tr#'+i).append('<td><div class="circle" style="background-color: orange"><div></td>');
                                    break;
                                case 'bassa':
                                        $('#contenitoreTodo table tbody tr#'+i).append('<td><div class="circle" style="background-color: yellow"><div></td>');
                                    break;
                                default:
                                    $('#contenitoreTodo table tbody tr#'+i).append('<td>'+value+'</td>');
                                break;
                            }
                        }
                    });
                }
            });
        },
        //Errore
        error: function(e){
            alert('Error! Connection refused, server down!')
        }
    });
}

//passa una riga da una lista all'altra a seconda della lista in cui si trova
function check(id, done){
    //chiamata in PATCH al server per aggiornare un singolo valore di un determinato oggetto
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


var liChecked=[];
//elimina o passa all'altra lista più elementi contemporaneamente
function checkLi(id, done, th){
    $('#contenitoreTabs p').show();
    
    //confronta se la checkbox cliccata è stata attivata o diisattivata
    switch($(th).prop('checked')){
        //checkbox attivata
        case true:
            //confronta se la riga si trova nella lista todo oppure done
            if(done){
                //rimuove le opzioni per un nuovo rendering che mostra le opzioni "ancora da fare" o "elimina"
                $('select[name=selectDone] option').remove();
                $('select[name=selectDone]').append('<option selected><option value="stillTodo">Still Todo</option></option><option value="delete">Delete</option>');       
                //inserisce nell'array un oggetto con le chiavi id e checked per poi apportare le modifiche
                liChecked[liChecked.length]={'id': id, 'checked':true};
            }else{
                
                //rimuovo le opzioni per un nuovo rendering che mostra le opzioni "fatto" o "elimina"
                $('select[name=selectTodo] option').remove();
                $('select[name=selectTodo]').append('<option selected></option><option value="done">Done</option><option value="delete">Delete</option>');
                //inserisce nell'array un oggetto con le chiavi id e checked per poi apportare le modifiche                
                liChecked[liChecked.length]={'id': id, 'checked':true};
            }
            break;
        case false:
                //se i checkbox della lista Todo non sono tutti attivati allora mostra il tasto select  
                if($('#contenitoreTodo input[type=checkbox]').length != $('#contenitoreTodo input[type=checkbox]').filter(':checked').length){
                    $('#selectAllTodo').show();
                }
                //se i checkbox della lista Done non sono tutti attivati allora mostra il tasto select
                if($('#contenitoreDone input[type=checkbox]').length != $('#contenitoreDone input[type=checkbox]').filter(':checked').length){
                    $('#selectAllDone').show();
                }
                //filtro le checkbox disabilitate e se non ce ne sono disabilito la select delle opzioni
                if($('#contenitoreTabs input[type=checkbox]').filter(':checked').length==0){
                    $('#contenitoreTabs p').hide();
                }
                //trovami nell'array l'elemento con lo stesso id e toglilo dalla lista delle modifiche
                $.each(liChecked, function(i){
                    if(liChecked[i].id == id){
                        liChecked[i].checked = false;
                    }
                })
            break;
    }
}

//conferma l'opzione scelta ed eseguila sulle righe dove la checkbox è attivata
function confirmSelect(){
    //confronta il valore della select delle opzioni
    switch($('select[name=selectTodo]').val()||$('select[name=selectDone]').val()){
        case 'done':
            //per ogni riga checkata cambiami lista, opzione "fatto" della select
            $.each(liChecked, function(i){
                if(liChecked[i].checked){
                    $.ajax({
                        dataType: 'json',
                        type: 'PATCH',
                        url: 'http://localhost:3000/todos/'+liChecked[i].id,
                        data: {"done": true},
                        success: function(){
                            updateTodoList();
                        }
                    })
                }
            })
            break;
        case 'stillTodo':
            //per ogni riga checkata cambiami la lista, opzione "da fare" della select
            $.each(liChecked, function(i){
                if(liChecked[i].checked){
                    $.ajax({
                        dataType: 'json',
                        type: 'PATCH',
                        url: 'http://localhost:3000/todos/'+liChecked[i].id,
                        data: {"done": false},
                        success: function(){
                            updateTodoList();
                        }
                    })
                }
            })
            break;
        case 'delete':
            //per ogni riga checkata elimina dalla lista, opzione "elimina" della select
            $.each(liChecked, function(i){
                if(liChecked[i].checked){
                    $.ajax({
                        dataType: 'json',
                        type: 'DELETE',
                        url: 'http://localhost:3000/todos/'+liChecked[i].id,
                        success: function(){
                            updateTodoList();
                        }
                    })
                }
            })
            break;
        default:
            //errore se la select ha come opzione vuota
            $('select[name=selectTodo]').css('border', 'solid 1px red');
            $('select[name=selectDone]').css('border', 'solid 1px red');
            break;
    }
}