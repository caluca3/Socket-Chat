const url = window.location.hostname.includes('localhost')
    ?'http://localhost:8080/api/auth/'
    :'http://localhost:8080'

function handleCredentialResponse(response) {
    //Google token ID_TOKEN
    const body = {id_token:response.credential}

    //console.log({response});
    
    fetch(url + 'google',{
        method:'POST',
        headers: { 
            'Content-Type': 'application/json'
         },
        body: JSON.stringify( body )
   })
        .then(res => res.json())
        .then(({token}) =>{
           localStorage.setItem('token',token);
            window.location = 'chat.html';
        })
        .catch(console.warn);
}


const miFormulario = document.querySelector('form');

miFormulario.addEventListener('submit', async(e)=>{
    e.preventDefault();
    const formData = {};

    for(let el of miFormulario.elements){
        if (el.name.length > 0) 
            formData[el.name] = el.value
    
    }
    await fetch(url + 'login',{
        method:'POST',
        body:JSON.stringify(formData),
        headers:{'Content-Type': 'application/json'}
    })
    .then(res => res.json())
    .then(data =>{
       // console.log(data);
        window.location = 'chat.html';
    })
    .catch(err =>{
        console.log(err);
    })
});



const button = document.getElementById('sing-out');
button.onclick= ()=>{
    //console.log(google.accounts.id);
    google.accounts.id.disableAutoSelect();

    google.accounts.id.revoke(localStorage.getItem('email'),(done)=>{
        localStorage.clear()
        location.reload();
    });
}