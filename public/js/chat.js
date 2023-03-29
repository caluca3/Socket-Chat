const url = window.location.hostname.includes('localhost')
    ?'http://localhost:8080/api/auth/'
    :'http://localhost:8080'


let usuario= null;
let socket = null;

//*Referencias HTML
const txtUid     = document.querySelector('#txtUid');
const txtMsj     = document.querySelector('#txtMsj');
const ulUsuarios = document.querySelector('#ulUsuarios');
const ulMensajes = document.querySelector('#ulMensajes');
const btnSalir   = document.querySelector('#btnSalir');


//Validar token del localStorage
const validarJWT = async() =>{
    const token = localStorage.getItem('token') || '';
    
    if (token.length <=10) {
        window.location='index.html';
        throw new Error('No existe un token')
    }

    const resp = await fetch(url,{
        headers:{'x-token':token}
    });

    const {usuario:usuarioDB,token:tokenDB} = await resp.json();
   // console.log(usuarioDB,tokenDB);
    localStorage.setItem('token',tokenDB);
    usuario= usuarioDB;

    document.title = await usuario.nombre

    conectarSocket();
}

const conectarSocket = async()=>{
    socket = io({
        'extraHeaders':{
            'x-token':localStorage.getItem('token')
        }
    });

    socket.on('connect',()=>{
        console.log('On-Line');
    });

    socket.on('disconnect',()=>{
        console.log('Off-Line');
    });

    socket.on('recibir-mensajes',dibujarMensajes);

    socket.on('usuarios-activos',dibujarUsuarios);

    socket.on('mensaje-privado',(payload)=>{
        console.log("Para:", payload);
    });

}

const dibujarUsuarios =(usuarios=[])=>{
    
    let usuariosHTML='';
    usuarios.forEach( ({nombre,uid}) => {
        usuariosHTML +=`
        <li>
          <p>
            <h5 class="text-success">${nombre}</h5>
            <span class="fs-6 text-muted">${uid}</span>
          </p>
        </li>
        `;
    }); 
    ulUsuarios.innerHTML = usuariosHTML;
}

const dibujarMensajes =(mensajes=[])=>{
    
    let mensajesHTML='';
    mensajes.forEach( ({nombre,mensaje}) => {
        mensajesHTML +=`
        <li>
          <p>
            <span class="text-primary">${nombre}</span>
            <span >${mensaje}</span>
          </p>
        </li>
        `;
    }); 
    ulMensajes.innerHTML = mensajesHTML;
}


txtMsj.addEventListener('keyup',({keyCode})=>{
    const mensaje = txtMsj.value;
    const uid = txtUid.value

    if (keyCode != 13) {return;}
    if (mensaje.length === 0) {return;}

    socket.emit('enviar-mensaje',{mensaje,uid});
    txtMsj.value = '';
});



const main = async()=>{
    //validar JWT
    await validarJWT();
}


main();


