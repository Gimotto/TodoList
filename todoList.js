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

        //Validazione del campo titolo (essendo l'unico obbligatorio)
        if(!inputs.title){
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
    
    //Annulla la modifica di un elemento
    $('#deleteEdit').on('click', function(){
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

    //Conferma la modifica di un elemento
    $('#confirmEdit').on('click', function(){
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
            $('input[type=submit]').css('display', 'none');
            $('#deleteEdit').css('display', 'block');
            $('#confirmEdit').css('display', 'block').attr('class', id);
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
                        $('#contenitoreDone ul').append('<li id="'+i+'"><input id="wow" type="checkbox" onchange="checkLi('+a[i].id+','+a[i].done+', this)"></li><button onclick="deleteTodo('+a[i].id+')">Delete</button><button onclick="check('+a[i].id+', '+a[i].done+')">StillTodo</button>');
                        //per ogni oggetto recupera il nome della chiave e il valore
                        $.each(a[i], function(name, value){
                            //non mostrare le seguenti chiavi con nome: done e id; anche chi non ha valore
                            if(name!='done' && name!='id' && value){
                                //inserimento della chiave con il corrispettivo valore
                                $('#contenitoreDone ul li#'+i).append('<strong>'+name+'</strong>'+': '+value+'<strong>; </strong>');
                            }
                        });
                    }else{
                        $('#contenitoreTodo ul').append('<li id="'+i+'"><input type="checkbox" onclick="checkLi('+a[i].id+','+a[i].done+', this)"></li><button onclick="editTodo('+a[i].id+')">Edit</button><button onclick="deleteTodo('+a[i].id+')">Delete</button><button onclick="check('+a[i].id+')">Done</button>');
                        //per ogni oggetto recupera il nome della chiave e il valore
                        $.each(a[i], function(name, value){
                            //non mostrare le seguenti chiavi con nome: done e id; anche chi non ha valore
                            if(name!='id'&& name!='done' && value){
                                //inserimento della chiave con il corrispettivo valore
                                $('#contenitoreTodo ul li#'+i).append('<strong>'+name+'</strong>'+': '+ value + '<strong>; </strong>');     
                            }
                        });
                    }
                });
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
    $('#contenitoreTabs p').css('display', 'block');
    
    //confronta se la checkbox cliccata è stata attivata o diisattivata
    switch($(th).prop('checked')){
        //checkbox attivata
        case true:
            //confronta se la riga si trova nella lista todo oppure done
            if(done){
                //rimuovo le opzioni per un nuovo rendering che mostra le opzioni "ancora da fare" o "elimina"
                $('select[name=selectLi] option').remove();
                $('select[name=selectLi]').append('<option selected><option value="stillTodo">Still Todo</option></option><option value="delete">Delete</option>');       
                //inserisce nell'array un oggetto con le chiavi id e checked per poi apportare le modifiche
                liChecked[liChecked.length]={'id': id, 'checked':true};
            }else{
                //rimuovo le opzioni per un nuovo rendering che mostra le opzioni "fatto" o "elimina"
                $('select[name=selectLi] option').remove();
                $('select[name=selectLi]').append('<option selected></option><option value="done">Done</option><option value="delete">Delete</option>');
                //inserisce nell'array un oggetto con le chiavi id e checked per poi apportare le modifiche                
                liChecked[liChecked.length]={'id': id, 'checked':true};
            }
            break;
        case false:
                //filtro le checkbox disabilitate e se non ce ne sono disabilito la select delle opzioni
                if($('#contenitoreTabs input[type=checkbox]').filter(':checked').length==0){
                    $('#contenitoreTabs p').css('display', 'none');
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
    switch($('select[name=selectLi]').val()){
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
            $('select[name=selectLi]').css('border', 'solid 1px red');
            break;
    }
}